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
import { coleAPI, getServerUrl } from "@/lib/utils";
import type { AddStudentData, Department } from "@/types/data.types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { io as ioClient } from "socket.io-client";
import { AlertCircle } from "lucide-react";

export const AddStudent = () => {
  const navigate = useNavigate();
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
    setError,
    clearErrors,
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
      guardianPhone: "",
      departmentId: undefined,
      year: 1,
      photo: undefined,
    },
  });

  // listen for rfid tap events and notify server of register mode
  useEffect(() => {
    const socket = ioClient(getServerUrl);

    // tell server to skip attendance recording while this page is open
    socket.emit("enter_register_mode");

    socket.on("rfid_scanned", (data: { rfidTag: string }) => {
      if (data?.rfidTag) {
        clearErrors("rfidTag");
        setValue("rfidTag", data.rfidTag, { shouldValidate: true });
        toast.info(`RFID Tag captured: ${data.rfidTag}`);
      }
    });

    return () => {
      socket.emit("exit_register_mode");
      socket.disconnect();
    };
  }, [setValue, clearErrors]);

  const { mutateAsync: addStudent, isPending } = useMutation({
    mutationFn: coleAPI("/students/add", "POST"),
    onSuccess: () => {
      toast.success("Student added successfully");
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message || "";
        const status = error.response?.status;
        if (
          status === 409 ||
          msg === "Already exists!" ||
          msg.toLowerCase().includes("rfid") ||
          msg.toLowerCase().includes("already")
        ) {
          const duplicateMsg =
            msg || "RFID tag is already registered to another student.";
          setError("rfidTag", {
            type: "manual",
            message: duplicateMsg,
          });
          toast.error(duplicateMsg);
          return;
        }
      }
      toast.error("Error adding student.");
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
      form.append("guardianName", data.guardianName.trim());
      form.append("guardianPhone", data.guardianPhone.trim());
      form.append("departmentId", String(data.departmentId));
      form.append("year", String(data.year));
      if (photoFile) form.append("photo", photoFile);

      await addStudent(form as unknown as object);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-5 px-8 max-w-5xl mx-auto">
      <Card className="w-full mx-auto gap-1 bg-white/95 backdrop-blur-sm shadow-lg border border-slate-100">
        <CardHeader className="gap-1 text-center">
          <CardTitle className="text-xl">Add New Student</CardTitle>
          <CardDescription>Fill out the required fields below.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 mt-4">
          <FieldSet>
            <FieldGroup className="w-full grid grid-cols-[1fr_1fr_1fr_max-content]">
              <Field className="gap-0.5">
                <FieldLabel className="flex justify-between items-center">
                  <FieldTitle>RFID Tag</FieldTitle>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Listening for tap...
                  </span>
                </FieldLabel>
                <FieldContent>
                  <input
                    className={`w-full rounded-md border px-3 py-2 transition-colors ${
                      errors.rfidTag
                        ? "border-red-500 bg-red-50/50 text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                        : "border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-950"
                    }`}
                    placeholder="1029384756"
                    {...register("rfidTag", {
                      required: "RFID tag is required",
                      onChange: () => clearErrors("rfidTag"),
                    })}
                  />
                  {errors.rfidTag ? (
                    <div className="flex items-center gap-1 mt-1 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.rfidTag.message}</span>
                    </div>
                  ) : (
                    <FieldError errors={[]} />
                  )}
                </FieldContent>
              </Field>
              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Last name</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Dela Cruz"
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
                    placeholder="Juan"
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
                    placeholder="P"
                    {...register("middleInitial")}
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <FieldGroup className="w-full grid grid-cols-4">
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
                    errors={[
                      errors.birthDate
                        ? { message: errors.birthDate.message }
                        : undefined,
                    ]}
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
                    placeholder="Salug, Zamboanga del Norte"
                    {...register("address", {
                      required: "Address is required",
                    })}
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

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Guardian name</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    className="rounded-md border px-3 py-2"
                    placeholder="Maria Dela Cruz"
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

              <Field className="gap-0.5">
                <FieldLabel>
                  <FieldTitle>Guardian phone</FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="tel"
                    className="rounded-md border px-3 py-2"
                    placeholder="09123456789"
                    {...register("guardianPhone", {
                      required: "Guardian phone is required",
                    })}
                  />
                  <FieldError
                    errors={[
                      errors.guardianPhone
                        ? { message: errors.guardianPhone.message }
                        : undefined,
                    ]}
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
                  <Select
                    defaultValue={
                      watch("departmentId") ? String(watch("departmentId")) : ""
                    }
                    onValueChange={(v: string) =>
                      setValue(
                        "departmentId",
                        parseInt(
                          v,
                          10,
                        ) as unknown as AddStudentData["departmentId"],
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
                {isPending ? "Saving..." : "Add Student"}
              </Button>
              <Button variant="outline" type="button" onClick={() => reset()}>
                Reset
              </Button>
              <Button
                variant="ghost"
                type="button"
                onClick={() => navigate("/manage-students")}
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
