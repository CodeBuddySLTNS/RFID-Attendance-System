import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { coleAPI } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const Signup = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const { mutateAsync: signup, isPending } = useMutation({
    mutationFn: coleAPI("/auth/signup", "POST"),
    onSuccess: (data: {
      token: string;
      refreshToken: string;
      faculty: { id: number; name: string; username: string };
    }) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("faculty", JSON.stringify(data.faculty));
      toast.success("Account created successfully!");
      navigate("/manage-students");
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("failed to create account");
      }
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await signup(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex justify-center py-5 items-center h-full bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg border border-slate-100 bg-white">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Faculty Sign Up
          </CardTitle>
          <CardDescription className="text-slate-500">
            Create an account to manage your students
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 pt-2">
          <FieldSet className="space-y-4">
            <FieldGroup className="flex flex-col gap-4">
              <Field className="gap-1">
                <FieldLabel>
                  <FieldTitle className="text-slate-700 text-sm font-semibold">
                    Full Name
                  </FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="text"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Dr. John Doe"
                    {...register("name", {
                      required: "name is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.name
                        ? [{ message: errors.name.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-1">
                <FieldLabel>
                  <FieldTitle className="text-slate-700 text-sm font-semibold">
                    Username
                  </FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="text"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="username"
                    {...register("username", {
                      required: "username is required",
                    })}
                  />
                  <FieldError
                    errors={
                      errors.username
                        ? [{ message: errors.username.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>

              <Field className="gap-1">
                <FieldLabel>
                  <FieldTitle className="text-slate-700 text-sm font-semibold">
                    Password
                  </FieldTitle>
                </FieldLabel>
                <FieldContent>
                  <input
                    type="password"
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="••••••••"
                    {...register("password", {
                      required: "password is required",
                      minLength: {
                        value: 6,
                        message: "password must be at least 6 characters",
                      },
                    })}
                  />
                  <FieldError
                    errors={
                      errors.password
                        ? [{ message: errors.password.message }]
                        : undefined
                    }
                  />
                </FieldContent>
              </Field>
            </FieldGroup>

            <Button type="submit" className="w-full mt-4" disabled={isPending}>
              {isPending ? "Creating account..." : "Sign Up"}
            </Button>

            <div className="text-center text-sm text-slate-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-semibold"
              >
                Sign in here
              </Link>
            </div>
          </FieldSet>
        </form>
      </Card>
    </div>
  );
};
