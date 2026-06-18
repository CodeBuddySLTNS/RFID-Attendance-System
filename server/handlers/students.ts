import { Request, Response } from "express";
import { Student } from "../database/models/student.js";
import { CustomError } from "../lib/utils.js";

const getStudents = async (_req: Request, res: Response) => {
  const facultyId = res.locals.facultyId;
  const students = await Student.getAll(facultyId);
  res.json(students);
};

const addStudent = async (req: Request, res: Response) => {
  const {
    rfidTag,
    firstName,
    lastName,
    birthDate,
    address,
    guardianName,
    departmentId,
    year,
  } = req.body;

  const facultyId = res.locals.facultyId;
  const payload = {
    ...req.body,
    ...(req.file && { photo: `/uploads/${req.file.filename}` }),
    facultyId,
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

const getStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const facultyId = res.locals.facultyId;
  const student = await Student.getInfo(Number(id), facultyId);
  if (!student) {
    res.status(404).json({ message: "Student not found" });
    return;
  }
  res.json(student);
};

const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const facultyId = res.locals.facultyId;
  const payload: Record<string, unknown> = {
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

  const updateData: Record<string, unknown> = {};
  for (const key of allowed) {
    if (payload[key] !== undefined) updateData[key] = payload[key];
  }

  await Student.update(Number(id), updateData, facultyId);
  res.json({ message: "Student updated successfully" });
};

const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const facultyId = res.locals.facultyId;
  await Student.remove(Number(id), facultyId);
  res.json({ message: "Student deleted successfully" });
};

export default {
  getStudents,
  addStudent,
  getStudent,
  updateStudent,
  deleteStudent,
};
