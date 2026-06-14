import { prisma } from "../../lib/prisma.js";

export const Department = {
  getAll: async () => {
    return await prisma.department.findMany();
  },
};
