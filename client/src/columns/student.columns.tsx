import type { Student } from "@/types/data.types";
import type { ColumnDef } from "@tanstack/react-table";
import config from "../../system.config.json";

const url = config.isProduction
  ? config.prodServer + "/api"
  : config.devServer + "/api";

export const studentColumns: ColumnDef<Student>[] = [
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
];
