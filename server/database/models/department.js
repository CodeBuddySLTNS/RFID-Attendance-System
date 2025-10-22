import { sqlQuery } from "../sqlQuery.js";

export const Department = {
  getAll: async () => {
    return await sqlQuery("SELECT * FROM departments");
  },
};
