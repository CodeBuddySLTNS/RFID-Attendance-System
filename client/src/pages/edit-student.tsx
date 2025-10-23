import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { coleAPI } from "@/lib/utils";
import type { AddStudentData, Department, Student } from "@/types/data.types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useParams, useNavigate } from "react-router-dom";

export const EditStudent = () => {
  const { id } = useParams();
  const studentId = Number(id);
  const navigate = useNavigate();

  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
  });

  const { data: student, isLoading } = useQuery<Student>({
    queryKey: ["student", studentId],
    queryFn: () => coleAPI(`/students/${studentId}`)({}),
    enabled: !!studentId,
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddStudentData>({
    defaultValues: {
      rfidTag: "",
      firstName: "",
      lastName: "",
      middleInitial: "",
      birthDate: "",
      address: "",
      guardianName: "",
      departmentId: undefined,
      year: 1,
      photo: undefined,
    },
  });

  useEffect(() => {
    if (student) {
      setValue("rfidTag", student.rfidTag);
      setValue("firstName", student.firstName);
      setValue("lastName", student.lastName);
      const tmp = student as unknown as { middleInitial?: string };
      setValue("middleInitial", tmp.middleInitial ?? "");
      setValue(
        "birthDate",
        student.birthDate?.split("T")?.[0] ?? student.birthDate
      );
      setValue("address", student.address);
      setValue("guardianName", student.guardianName);
      setValue("departmentId", student.departmentId as unknown as number);
      setValue("year", student.year as unknown as number);
    }
  }, [student, setValue]);

  const { mutateAsync: updateStudent, isPending } = useMutation({
    mutationFn: (form: FormData) =>
      coleAPI(`/students/${studentId}`, "PATCH")(form as unknown as object),
    onSuccess: () => {
      toast.success("Student updated successfully");
      navigate("/manage-students");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(String(error.response?.data?.message));
      } else {
        toast.error("Error updating student.");
      }
    },
  });

  const onSubmit = async (data: AddStudentData) => {
    try {
      const form = new FormData();
      if (data.rfidTag) form.append("rfidTag", data.rfidTag.trim());
      if (data.firstName) form.append("firstName", data.firstName.trim());
      if (data.middleInitial)
        form.append("middleInitial", data.middleInitial.trim());
      if (data.lastName) form.append("lastName", data.lastName.trim());
      if (data.birthDate) form.append("birthDate", data.birthDate);
      if (data.address) form.append("address", data.address.trim());
      if (data.guardianName) form.append("guardianName", data.guardianName);
      if (data.departmentId)
        form.append("departmentId", String(data.departmentId));
      if (data.year) form.append("year", String(data.year));
      if (photoFile) form.append("photo", photoFile);

      await updateStudent(form);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <Card className="max-w-3xl mx-auto gap-1">
        <CardHeader className="gap-1 text-center">
          <CardTitle className="text-2xl">Edit Student</CardTitle>
          <CardDescription>
            Update the student's information below.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 mt-4 space-y-4">
          <FieldSet>
            <Field>
              <FieldLabel>
                <FieldTitle>RFID Tag</FieldTitle>
              </FieldLabel>
              <FieldContent>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  {...register("rfidTag", { required: "RFID tag is required" })}
                />
                <FieldError
                  errors={[
                    errors.rfidTag
                      ? { message: errors.rfidTag.message }
                      : undefined,
                  ]}
                />
              </FieldContent>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Last name</label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  {...register("lastName", { required: true })}
                />
              </div>
              <div>
                <label className="block mb-1">First name</label>
                <input
                  className="w-full rounded-md border px-3 py-2"
                  {...register("firstName", { required: true })}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Middle initial</label>
              <input
                className="w-20 rounded-md border px-3 py-2"
                maxLength={1}
                {...register("middleInitial")}
              />
            </div>

            <div>
              <label className="block mb-1">Birth date</label>
              <input
                type="date"
                className="rounded-md border px-3 py-2"
                {...register("birthDate", { required: true })}
              />
            </div>

            <div>
              <label className="block mb-1">Address</label>
              <input
                className="rounded-md border px-3 py-2 w-full"
                {...register("address", { required: true })}
              />
            </div>

            <div>
              <label className="block mb-1">Guardian name</label>
              <input
                className="rounded-md border px-3 py-2 w-full"
                {...register("guardianName", { required: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Department</label>
                <select
                  className="w-full rounded-md border px-3 py-2"
                  onChange={(e) =>
                    setValue("departmentId", Number(e.target.value))
                  }
                  value={String(student?.departmentId ?? "")}
                >
                  <option value="">Select department</option>
                  {departments?.map((d) => (
                    <option key={d.departmentId} value={d.departmentId}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Year</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  className="w-full rounded-md border px-3 py-2"
                  {...register("year", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Update Student"}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </div>
          </FieldSet>
        </form>
      </Card>
    </div>
  );
};

export default EditStudent;
