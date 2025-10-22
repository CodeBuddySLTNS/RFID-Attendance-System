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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { coleAPI } from "@/lib/utils";
import type { AddStudentData, Department } from "@/types/data.types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const AddStudent = () => {
  const { data: departments } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: coleAPI("/departments"),
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
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

  const { mutateAsync: addStudent, isPending } = useMutation({
    mutationFn: coleAPI("/students/add", "POST"),
    onSuccess: () => {
      toast.success("Student added successfully");
      reset();
    },
    onError: (error) => {
      if (
        isAxiosError(error) &&
        error.response?.data?.message === "Already exists!"
      ) {
        toast.error("RFID tag already exists. Please use a different tag.");
      } else {
        toast.error(`Error adding student.`);
      }
    },
  });

  const onSubmit = async (data: AddStudentData) => {
    try {
      const form = new FormData();
      form.append("rfidTag", data.rfidTag.trim());
      form.append("firstName", data.firstName.trim());
      if (data.middleInitial)
        form.append("middleInitial", data.middleInitial.trim());
      form.append("lastName", data.lastName.trim());
      form.append("birthDate", data.birthDate);
      form.append("address", data.address.trim());
      form.append("guardianName", data.guardianName);
      form.append("departmentId", String(data.departmentId));
      form.append("year", String(data.year));
      if (photoFile) form.append("photo", photoFile);

      await addStudent(form as unknown as object);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-10">
      <Card className="max-w-3xl mx-auto gap-1">
        <CardHeader className="gap-1 text-center">
          <CardTitle className="text-2xl">Add New Student</CardTitle>
          <CardDescription>Fill out the required fields below.</CardDescription>
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

            <FieldGroup className="w-full grid grid-cols-[1fr_1fr_max-content] space-y-2">
              <Field>
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

              <Field>
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

              <Field>
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

            <Field>
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
                  errors={[
                    errors.birthDate
                      ? { message: errors.birthDate.message }
                      : undefined,
                  ]}
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>
                <FieldTitle>Address</FieldTitle>
              </FieldLabel>
              <FieldContent>
                <input
                  className="rounded-md border px-3 py-2"
                  {...register("address", { required: "Address is required" })}
                />
                <FieldError
                  errors={[
                    errors.address
                      ? { message: errors.address.message }
                      : undefined,
                  ]}
                />
              </FieldContent>
            </Field>

            <Field>
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
                  errors={[
                    errors.guardianName
                      ? { message: errors.guardianName.message }
                      : undefined,
                  ]}
                />
              </FieldContent>
            </Field>

            <FieldGroup className="w-full grid grid-cols-[2fr_1fr]">
              <Field>
                <FieldLabel>
                  <FieldTitle>Department</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <Select
                    defaultValue={
                      watch("departmentId") ? String(watch("departmentId")) : ""
                    }
                    onValueChange={(v: string) =>
                      setValue(
                        "departmentId",
                        parseInt(
                          v,
                          10
                        ) as unknown as AddStudentData["departmentId"]
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {departments?.map((d) => (
                          <SelectItem
                            key={String(d.departmentId)}
                            value={String(d.departmentId)}
                          >
                            {String(d.departmentName)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <input
                    type="hidden"
                    {...register("departmentId", {
                      required: "Department is required",
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError
                    errors={
                      errors.departmentId
                        ? [{ message: errors.departmentId.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>
                  <FieldTitle>Year</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="number"
                    min={1}
                    max={4}
                    className="w-full rounded-md border px-3 py-2"
                    {...register("year", {
                      required: "Year is required",
                      valueAsNumber: true,
                    })}
                  />
                  <FieldError
                    errors={
                      errors.year
                        ? [{ message: errors.year.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <Field>
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
                {isPending ? "Saving..." : "Add Student"}
              </Button>
              <Button variant="outline" type="button" onClick={() => reset()}>
                Reset
              </Button>
            </div>
          </FieldSet>
        </form>
      </Card>
    </div>
  );
};
