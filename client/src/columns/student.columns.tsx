import type { Student } from "@/types/data.types";
import type { ColumnDef } from "@tanstack/react-table";
import config from "../../system.config.json";
import { Edit, Trash2 } from "lucide-react";

const url = config.isProduction
  ? config.prodServer + "/api"
  : config.devServer + "/api";

export const studentColumns: (
  editFn: (id: number) => void,
  deleteFn: (id: number) => void
) => ColumnDef<Student>[] = (editFn, deleteFn) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const photo = row.original.photo
        ? `${url}${row.original.photo}`
        : "/images/default-icon.png";

      return (
        <div className="flex items-center gap-2 capitalize">
          <img
            className="w-9 aspect-square rounded-full border border-gray-300"
            src={photo}
            alt="img"
          />
          <span>{row.getValue("name")}</span>
        </div>
      );
    },
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
      <div className="text-center">
        {new Date(row.getValue("birthDate")).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}
      </div>
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
    accessorKey: "guardianName",
    header: () => <div className="text-center">Parent/Guardian</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue("guardianName")}</div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const studentId = row.original.id;
      return (
        <div className="flex gap-1 justify-center">
          <Edit
            className="w-9 rounded p-0.5 py-1 bg-green-400 shadow"
            onClick={() => editFn(studentId)}
          />
          <Trash2
            className="w-9 rounded p-0.5 py-1 bg-red-400 shadow"
            onClick={() => deleteFn(studentId)}
          />
        </div>
      );
    },
  },
];
