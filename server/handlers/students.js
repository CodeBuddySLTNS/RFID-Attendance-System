import { Student } from "../database/models/student.js";
import { CustomError } from "../lib/utils.js";

const getStudents = async (req, res) => {
  const students = await Student.getAll();
  res.json(students);
};

const addStudent = async (req, res) => {
  const {
    rfidTag,
    firstName,
    middleInitial,
    lastName,
    birthDate,
    address,
    guardianName,
    departmentId,
    year,
  } = req.body;

  const payload = {
    ...req.body,
    ...(req.file && { photo: `/uploads/${req.file.filename}` }),
  };

  if (
    !rfidTag ||
    !firstName ||
    !lastName ||
    !birthDate ||
    !address ||
    !guardianName ||
    !departmentId ||
    !year
  ) {
    throw new CustomError("Missing required fields", 400);
  }

  const result = await Student.add(payload);

  res.status(201).json({
    message: "Student added successfully",
    studentId: result.insertId,
  });
};

export default { getStudents, addStudent };
