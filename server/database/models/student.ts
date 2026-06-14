import { prisma } from "../../lib/prisma.js";

// helper to build the formatted name
const formatName = (s: { lastName: string; firstName: string; middleInitial: string | null }) =>
  `${s.lastName}, ${s.firstName}${s.middleInitial ? ` ${s.middleInitial}.` : ""}`;

// shared include for department join
const withDepartment = { department: true } as const;

export const Student = {
  getAll: async () => {
    const rows = await prisma.student.findMany({ include: withDepartment });
    return rows.map((s) => ({
      ...s,
      name: formatName(s),
      department: s.department?.acronym ?? null,
    }));
  },

  getInfo: async (id: number) => {
    const s = await prisma.student.findUnique({
      where: { id },
      include: withDepartment,
    });
    if (!s) return null;
    return { ...s, name: formatName(s), department: s.department?.acronym ?? null };
  },

  getByRfid: async (rfidTag: string) => {
    const s = await prisma.student.findUnique({
      where: { rfidTag },
      include: withDepartment,
    });
    if (!s) return null;
    return { ...s, name: formatName(s), department: s.department?.acronym ?? null };
  },

  add: async (data: {
    rfidTag: string;
    firstName: string;
    middleInitial?: string;
    lastName: string;
    birthDate: string;
    address: string;
    guardianName: string;
    departmentId: number | string;
    year: number | string;
    photo?: string;
  }) => {
    const result = await prisma.student.create({
      data: {
        rfidTag: data.rfidTag,
        firstName: data.firstName,
        middleInitial: data.middleInitial || null,
        lastName: data.lastName,
        birthDate: new Date(data.birthDate),
        address: data.address,
        guardianName: data.guardianName,
        departmentId: Number(data.departmentId),
        year: Number(data.year),
        photo: data.photo || null,
      },
    });
    // keep backward compat with insertId shape
    return { insertId: result.id };
  },

  update: async (id: number, data: Record<string, unknown>) => {
    // cast numeric fields
    const cleaned: Record<string, unknown> = { ...data };
    if (cleaned.departmentId !== undefined) cleaned.departmentId = Number(cleaned.departmentId);
    if (cleaned.year !== undefined) cleaned.year = Number(cleaned.year);
    if (cleaned.birthDate !== undefined) cleaned.birthDate = new Date(cleaned.birthDate as string);

    await prisma.student.update({ where: { id }, data: cleaned });
  },

  remove: async (id: number) => {
    await prisma.student.delete({ where: { id } });
  },
};
