import { sqlQuery } from "../sqlQuery.js";

export const Student = {
  getAll: async () => {
    return await sqlQuery(
      `SELECT s.*, CONCAT(s.lastName, ', ', s.firstName, COALESCE(CONCAT(' ', s.middleInitial, '.'), '')) AS name, d.acronym AS department FROM students s
          LEFT JOIN departments d ON s.departmentId = d.departmentId`
    );
  },
  getInfo: async (id) => {
    return (
      await sqlQuery(
        `SELECT s.*, CONCAT(s.lastName, ', ', s.firstName, COALESCE(CONCAT(' ', s.middleInitial, '.'), '')) AS name, d.acronym AS department FROM students s
          LEFT JOIN departments d ON s.departmentId = d.departmentId WHERE s.id = ?`,
        [id]
      )
    )[0];
  },
  getByRfid: async (rfidTag) => {
    return (
      await sqlQuery(
        `SELECT s.*, CONCAT(s.lastName, ', ', s.firstName, COALESCE(CONCAT(' ', s.middleInitial, '.'), '')) AS name, d.acronym AS department FROM students s
          LEFT JOIN departments d ON s.departmentId = d.departmentId WHERE s.rfidTag = ?`,
        [rfidTag]
      )
    )[0];
  },
  add: async ({
    rfidTag,
    firstName,
    middleInitial,
    lastName,
    birthDate,
    address,
    guardianName,
    departmentId,
    year,
    photo,
  }) => {
    return await sqlQuery(
      `INSERT INTO students
        (rfidTag, firstName, middleInitial, lastName, birthDate, address, guardianName, departmentId, year, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rfidTag,
        firstName,
        middleInitial,
        lastName,
        birthDate,
        address,
        guardianName,
        departmentId,
        year,
        photo,
      ]
    );
  },
  update: async (id, data) => {
    const fields = [];
    const values = [];
    for (const key in data) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
    if (fields.length === 0) return;
    values.push(id);
    return await sqlQuery(
      `UPDATE students SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
  },
  remove: async (id) => {
    return await sqlQuery(`DELETE FROM students WHERE id = ?`, [id]);
  },
};
