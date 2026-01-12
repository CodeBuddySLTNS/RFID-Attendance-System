import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
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
    <div className="p-5 px-8">
      <Card className="w-full mx-auto gap-1">
        <CardHeader className="gap-1 text-center">
          <CardTitle className="text-2xl">Edit Student</CardTitle>
          <CardDescription>
            Update the student's information below.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 mt-4">
          <FieldSet>
            <FieldGroup className="w-full grid grid-cols-[1fr_1fr_1fr_max-content]">
              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>RFID Tag</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    {...register("rfidTag", {
                      required: "RFID tag is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.rfidTag
                        ? [{ message: errors.rfidTag.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Last name</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.lastName
                        ? [{ message: errors.lastName.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>First name</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.firstName
                        ? [{ message: errors.firstName.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel className="flex justify-center">
                  <FieldTitle>MI</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="w-10 rounded-md border px-3 py-2 text-center"
                    maxLength={1}
                    {...register("middleInitial")}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <FieldGroup className="w-full grid grid-cols-3">
              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Birth date</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="date"
                    className="rounded-md border px-3 py-2"
                    {...register("birthDate", {
                      required: "Birth date is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.birthDate
                        ? [{ message: errors.birthDate.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Address</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="rounded-md border px-3 py-2"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.address
                        ? [{ message: errors.address.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Guardian name</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="rounded-md border px-3 py-2"
                    {...register("guardianName", {
                      required: "Guardian name is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.guardianName
                        ? [{ message: errors.guardianName.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <FieldGroup className="w-full grid grid-cols-[2fr_1fr]">
              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Department</FieldTitle>
                </FieldLabel>
                <FieldContent>
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
                  <FieldError
                    errors={
                      errors.departmentId
                        ? [{ message: String(errors.departmentId?.message) }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Year</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    className="w-full rounded-md border px-3 py-2"
                    {...register("year", { valueAsNumber: true })}
                  />
                  <FieldError
                    errors={
                      errors.year
                        ? [{ message: String(errors.year?.message) }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <Field className="gap-0.5">
              <FieldLabel>
                <FieldTitle>Photo</FieldTitle>
              </FieldLabel>
              <FieldContent>
                <input
                  className="border-1 border-dashed p-2 rounded"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                />
                <FieldDescription>
                  Upload a photo for the student (optional)
                </FieldDescription>
              </FieldContent>
            </Field>

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
