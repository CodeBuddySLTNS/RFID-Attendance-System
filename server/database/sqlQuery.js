import status from "http-status";
import { pool } from "./sqlConnection.js";
import { CustomError } from "../lib/utils.js";

export const sqlQuery = async (query, params) => {
  let dbconn;
  try {
    dbconn = await pool.getConnection();
    const [rows] = await dbconn.query(query, params || []);
    return rows;
  } catch (error) {
    if (error) {
      switch (error.code) {
        case "ER_TABLE_EXISTS_ERROR":
          throw new CustomError(error.message, status.BAD_REQUEST, error);

        case "ER_DUP_ENTRY":
          throw new CustomError("Already exists!", status.CONFLICT, error);

        case "ECONNREFUSED":
          throw new CustomError(
            "Database connection error.",
            status.INTERNAL_SERVER_ERROR
          );

        case "ER_NO_REFERENCED_ROW_2":
        case "ER_ROW_IS_REFERENCED_2":
          throw new CustomError(
            "User was not registered.",
            status.BAD_REQUEST,
            error
          );

        default:
          throw new CustomError(error.message, status.CONFLICT, error);
      }
    }
  } finally {
    if (dbconn) dbconn.release();
  }
};
