import DataTablePagination from "@/components/datatable";
import { Button } from "@/components/ui/button";
import { coleAPI } from "@/lib/utils";
import { type Student } from "@/types/data.types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const ManageStudents = () => {
  const { data: students } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: coleAPI("/students"),
  });

  const navigate = useNavigate();
  const qc = useQueryClient();

  const { mutateAsync: deleteStudent } = useMutation({
    mutationFn: (id: number) => coleAPI(`/students/${id}`, "DELETE")({}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });

  const editFn = (studentId: number) => {
    navigate(`/manage-students/${studentId}/edit`);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const openDeleteDialog = (studentId: number) => {
    setSelectedId(studentId);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteStudent(selectedId);
      setDialogOpen(false);
      setSelectedId(null);
      alert("Student deleted");
    } catch (e) {
      console.error(e);
      alert("Failed to delete student");
    }
  };

  return (
    <div>
      <div className="px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <div className="border-l-8 border-orange-500 pl-3">
          <h2 className="font-bold text-2xl text-slate-800">
            Manage Students
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            View, add, edit, and delete student records under your faculty account
          </p>
        </div>

        <div>
          <Link to="/manage-students/new">
            <Button size="sm">Add Student</Button>
          </Link>
        </div>
      </div>
      <DataTablePagination
        data={students || []}
        editFn={editFn}
        deleteFn={openDeleteDialog}
      />

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
