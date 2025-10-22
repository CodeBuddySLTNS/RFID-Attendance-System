import DataTablePagination from "@/components/datatable";
import { Button } from "@/components/ui/button";
import { coleAPI } from "@/lib/utils";
import { type Student } from "@/types/data.types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export const ManageStudents = () => {
  const { data: students } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: coleAPI("/students"),
  });

  return (
    <div>
      <div className="px-6 flex items-center justify-between mt-4">
        <h2 className="font-bold text-xl border-l-5 border-orange-500 pl-2">
          Manage Students
        </h2>

        <div>
          <Link to="/manage-students/new">
            <Button size="sm">Add Student</Button>
          </Link>
        </div>
      </div>
      <DataTablePagination data={students || []} />
    </div>
  );
};
