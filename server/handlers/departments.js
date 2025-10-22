import { Department } from "../database/models/department.js";

const getDepartments = async (req, res) => {
  const departments = await Department.getAll();
  res.json(departments);
};

export default { getDepartments };
