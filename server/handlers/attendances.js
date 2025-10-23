import { Attendance } from "../database/models/attendance.js";
import { Student } from "../database/models/student.js";
import { CustomError } from "../lib/utils.js";

const getAttendances = async (req, res) => {
  const { date, count } = req.query;

  const attendances = date
    ? await Attendance.getByDate(date, count || 3)
    : await Attendance.getAll();
  res.json(attendances);
};

const addAttendance = async (req, res) => {
  const { rfidTag, timestamp, date } = req.body;

  if (!rfidTag || !timestamp || !date) {
    throw new Error("Missing required fields", 400);
  }

  const student = await Student.getByRfid(rfidTag);
  const lastTap = await Attendance.getStudentLastAttendance(student?.id, date);

  if (lastTap && lastTap.timestamp) {
    const lastTime = new Date(lastTap.timestamp).getTime();
    const nowTime = new Date(timestamp).getTime();

    if (!isNaN(lastTime) && !isNaN(nowTime)) {
      const diffMs = nowTime - lastTime;
      const minIntervalMs = 1 * 60 * 1000; // 1 minutes

      if (diffMs < minIntervalMs) {
        const secondsRemaining = Math.ceil((minIntervalMs - diffMs) / 1000);
        return res.status(429).json({
          error: "COOLDOWN_ACTIVE",
          message: `Please wait ${secondsRemaining} second(s) before tapping again.`,
          lastTimestamp: lastTap.timestamp,
        });
      }
    }
  }

  const type = lastTap?.type === "IN" ? "OUT" : "IN";

  if (!student) {
    throw new CustomError("Student not found", 404);
  }

  const result = await Attendance.add(student.id, type, timestamp, date);
  res.json({
    message: "Attendance added",
    id: result.insertId,
    name: student.name,
    firstName: student.firstName,
    lastName: student.lastName,
    department: student.department,
    year: student.year,
    photo: student.photo,
    timestamp,
    type,
  });
};

export default { getAttendances, addAttendance };
