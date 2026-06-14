import { Request, Response } from "express";
import { Department } from "../database/models/department.js";

const getDepartments = async (_req: Request, res: Response) => {
  const departments = await Department.getAll();
  res.json(departments);
};

export default { getDepartments };
