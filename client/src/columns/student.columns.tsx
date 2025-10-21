import type { Student } from "@/types/data.types";
import type { ColumnDef } from "@tanstack/react-table";

export const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "rfidTag",
    header: () => <div className="text-center">RFID</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("rfidTag")}</div>
    ),
  },
  {
    accessorKey: "birthDate",
    header: () => <div className="text-center">Birthdate</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("birthDate")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Address</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "department",
    header: () => <div className="text-center">Department</div>,
    cell: ({ row }) => (
      <div className="uppercase text-center">{row.getValue("department")}</div>
    ),
  },
  {
    accessorKey: "year",
    header: () => <div className="text-center">Year Level</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("year")}</div>
    ),
  },
  {
    accessorKey: "guradianName",
    header: () => <div className="text-center">Parent/Guardian</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("guradianName")}</div>
    ),
  },
];
