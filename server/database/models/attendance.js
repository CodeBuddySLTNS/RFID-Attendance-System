import { sqlQuery } from "../sqlQuery.js";

export const Attendance = {
  getAll: async () => {
    return await sqlQuery("SELECT * FROM attendances");
  },
  getByStudentId: async (studentId) => {
    return await sqlQuery(
      "SELECT * FROM attendances WHERE studentId = ? ORDER BY timestamp DESC",
      [studentId]
    );
  },
  add: async (studentId, type, timestamp, date) => {
    return await sqlQuery(
      `INSERT INTO attendances (studentId, type, timestamp, date) VALUES (?, ?, ?, ?)`,
      [studentId, type, timestamp, date]
    );
  },
};
