import { prisma } from "../../lib/prisma.js";

export const AnnouncementModel = {
  getPublic: async () => {
    return await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      include: { faculty: { select: { name: true } } },
    });
  },

  getAll: async (facultyId: number) => {
    return await prisma.announcement.findMany({
      where: { facultyId },
      orderBy: { createdAt: "desc" },
    });
  },

  getById: async (id: number, facultyId: number) => {
    return await prisma.announcement.findFirst({
      where: { id, facultyId },
    });
  },

  create: async (data: { message: string; facultyId: number }) => {
    return await prisma.announcement.create({ data });
  },

  update: async (id: number, facultyId: number, data: { message?: string }) => {
    return await prisma.announcement.updateMany({
      where: { id, facultyId },
      data,
    });
  },

  remove: async (id: number, facultyId: number) => {
    return await prisma.announcement.deleteMany({
      where: { id, facultyId },
    });
  },
};
