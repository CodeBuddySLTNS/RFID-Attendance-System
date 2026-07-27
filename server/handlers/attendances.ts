import { Request, Response } from "express";
import { Attendance } from "../database/models/attendance.js";
import { Student } from "../database/models/student.js";
import { CustomError, sendSMS } from "../lib/utils.js";

const getAttendances = async (req: Request, res: Response) => {
  const { date, count } = req.query;

  const attendances = date
    ? await Attendance.getByDate(date as string, (count as string) || 3)
    : await Attendance.getAll();
  res.json(attendances);
};

const addAttendance = async (req: Request, res: Response) => {
  const io = req.app.get("io");
  const rfidTag = req.body.rfidTag || req.body.rfid;
  let { timestamp, date } = req.body;

  if (!rfidTag) {
    throw new CustomError("Missing required fields", 400);
  }

  // default timestamp and date if not provided
  const now = new Date();
  if (!timestamp) {
    timestamp = now
      .toLocaleString("sv-SE", { timeZone: "Asia/Manila" })
      .replace("T", " ");
  }
  if (!date) {
    date = now.toISOString().slice(0, 10);
  }

  // check if any client is in register mode (add student page open)
  const isRegisterMode = req.app.get("registerMode")?.();

  if (io) {
    // broadcast scanned rfid tag
    io.emit("rfid_scanned", { rfidTag });
  }

  // in register mode, only broadcast the tag — skip attendance recording
  if (isRegisterMode) {
    res.json({
      message: "RFID tag scanned (register mode)",
      rfidTag,
      registerOnly: true,
    });
    return;
  }

  const student = await Student.getByRfid(rfidTag);

  if (!student) {
    const errorData = { status: 404, message: "Student not found", rfidTag };
    if (io) io.emit("attendance_error", errorData);

    throw new CustomError("Student not found", 404);
  }

  const lastTap = await Attendance.getStudentLastAttendance(student.id, date);

  if (lastTap && lastTap.timestamp) {
    const lastTime = new Date(lastTap.timestamp).getTime();
    const nowTime = new Date(timestamp).getTime();

    if (!isNaN(lastTime) && !isNaN(nowTime)) {
      const diffMs = nowTime - lastTime;
      const minIntervalMs = 1 * 60 * 1000; // 1 minute

      if (diffMs < minIntervalMs) {
        const secondsRemaining = Math.ceil((minIntervalMs - diffMs) / 1000);
        const cooldownData = {
          error: "COOLDOWN_ACTIVE",
          message: `Please wait ${secondsRemaining} second(s) before tapping again.`,
          rfidTag,
          studentId: student.id,
          lastTimestamp: lastTap.timestamp,
        };
        if (io) io.emit("attendance_error", cooldownData);

        res.status(429).json(cooldownData);
        return;
      }
    }
  }

  const type = lastTap?.type === "IN" ? "OUT" : "IN";

  const result = await Attendance.add(student.id, type, timestamp, date);

  const payload = {
    message: "Attendance added",
    id: result.insertId,
    name: student.name,
    firstName: student.firstName,
    lastName: student.lastName,
    department: student.department,
    year: student.year,
    photo: student.photo,
    rfidTag,
    timestamp,
    type,
  };

  if (io) {
    // broadcast tap event to connected clients
    io.emit("attendance_tapped", payload);
  }

  // send sms notification to guardian asynchronously
  // if (student.guardianPhone) {
  //   const tapDate = new Date(date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
  //   const tapTime = new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  //   sendSMS({
  //     toNumber: student.guardianPhone,
  //     messageBody: `Attendance Alert: ${student.firstName} ${student.lastName} has successfully checked ${type === "IN" ? "in" : "out"} on ${tapDate} at ${tapTime}.`,
  //   }).catch((err) => {
  //     console.error("failed to send sms:", err);
  //   });
  // }

  res.json(payload);
};

const getFacultyAttendances = async (req: Request, res: Response) => {
  const facultyId = res.locals.facultyId;
  const attendances = await Attendance.getAllByFaculty(Number(facultyId));
  res.json(attendances);
};

export default { getAttendances, addAttendance, getFacultyAttendances };
