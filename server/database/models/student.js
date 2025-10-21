import { sqlQuery } from "../sqlQuery.js";

export const Student = {
  getInfo: async (id) => {
    return (
      await sqlQuery(
        `SELECT s.*, CONCAT(s.lastName, ', ', s.firstName, ' ', s.middleInitial) AS name, d.acronym as department FROM students s 
          JOIN departments d ON s.departmentId = d.id WHERE id = ?`,
        [id]
      )
    )[0];
  },
  add: async ({
    rfidTag,
    firstName,
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
        (rfidTag, firstName, lastName, birthDate, address, guardianName, departmentId, year, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        rfidTag,
        firstName,
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
};
