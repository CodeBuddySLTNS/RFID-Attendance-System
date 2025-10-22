import { Attendance } from "../database/models/attendance.js";
import { Student } from "../database/models/student.js";

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
  const type = (await Attendance.getStudentLastAttendance(student.id, date))
    ? "OUT"
    : "IN";

  if (!student) {
    throw new Error("Student not found", 404);
  }

  const result = await Attendance.add(student.id, type, timestamp, date);
  res.json({
    message: "Attendance added",
    id: result.insertId,
    name: student.name,
    department: student.department,
    year: student.year,
    photo: student.photo,
    timestamp,
  });
};

export default { getAttendances, addAttendance };
