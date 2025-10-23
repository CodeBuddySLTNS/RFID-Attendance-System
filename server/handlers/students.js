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

const getStudent = async (req, res) => {
  const { id } = req.params;
  const student = await Student.getInfo(id);
  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }
  res.json(student);
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const payload = {
    ...req.body,
    ...(req.file && { photo: `/uploads/${req.file.filename}` }),
  };

  const allowed = [
    "rfidTag",
    "firstName",
    "middleInitial",
    "lastName",
    "birthDate",
    "address",
    "guardianName",
    "departmentId",
    "year",
    "photo",
  ];

  const updateData = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) updateData[key] = payload[key];
  }

  await Student.update(id, updateData);
  res.json({ message: "Student updated successfully" });
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  await Student.remove(id);
  res.json({ message: "Student deleted successfully" });
};

export default {
  getStudents,
  addStudent,
  getStudent,
  updateStudent,
  deleteStudent,
};
