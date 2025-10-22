import { sqlQuery } from "../sqlQuery.js";

export const Attendance = {
  getAll: async () => {
    return await sqlQuery("SELECT * FROM attendances");
  },
  getByDate: async (date, count = 3) => {
    return await sqlQuery(
      `SELECT a.*, CONCAT(s.lastName, ', ', s.firstName, COALESCE(CONCAT(' ', s.middleInitial), '')) AS name, d.acronym AS department 
      FROM attendances a LEFT JOIN students s ON a.studentId = s.id 
      LEFT JOIN departments d ON s.departmentId = d.departmentId 
      WHERE a.date = ? ORDER BY a.timestamp DESC LIMIT ?`,
      [date, count]
    );
  },
  getByStudentId: async (studentId) => {
    return await sqlQuery(
      "SELECT * FROM attendances WHERE studentId = ? ORDER BY timestamp DESC",
      [studentId]
    );
  },
  getStudentLastAttendance: async (studentId, date) => {
    return (
      await sqlQuery(
        "SELECT * FROM attendances WHERE studentId = ? AND date = ? ORDER BY timestamp DESC LIMIT 1",
        [studentId, date]
      )
    )[0];
  },
  add: async (studentId, type, timestamp, date) => {
    return await sqlQuery(
      `INSERT INTO attendances (studentId, type, timestamp, date) VALUES (?, ?, ?, ?)`,
      [studentId, type, timestamp, date]
    );
  },
};
