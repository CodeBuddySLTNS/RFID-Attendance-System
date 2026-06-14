import { prisma } from "../../lib/prisma.js";

export const Attendance = {
  getAll: async () => {
    return await prisma.attendance.findMany();
  },

  getByDate: async (date: string, count: number | string = 3) => {
    const rows = await prisma.attendance.findMany({
      where: { date: new Date(date) },
      include: {
        student: {
          include: { department: true },
        },
      },
      orderBy: { timestamp: "desc" },
      take: Number(count),
    });

    return rows.map((r) => {
      const s = r.student;
      return {
        id: r.id,
        studentId: r.studentId,
        type: r.type,
        timestamp: r.timestamp,
        date: r.date,
        name: s
          ? `${s.lastName}, ${s.firstName}${s.middleInitial ? ` ${s.middleInitial}.` : ""}`
          : null,
        department: s?.department?.acronym ?? null,
        photo: s?.photo ?? null,
        year: s?.year ?? null,
      };
    });
  },

  getByStudentId: async (studentId: number) => {
    return await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { timestamp: "desc" },
    });
  },

  getStudentLastAttendance: async (studentId: number, date: string) => {
    return await prisma.attendance.findFirst({
      where: { studentId, date: new Date(date) },
      orderBy: { timestamp: "desc" },
    }) ?? undefined;
  },

  add: async (studentId: number, type: string, timestamp: string, date: string) => {
    const result = await prisma.attendance.create({
      data: {
        studentId,
        type,
        timestamp: new Date(timestamp),
        date: new Date(date),
      },
    });
    return { insertId: result.id };
  },
};
