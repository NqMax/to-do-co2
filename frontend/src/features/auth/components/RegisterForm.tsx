import * as z from "zod";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultFormConfig } from "@/config/formConfig";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const registerSchema = z.object({
  email: z.email({ error: "Email must be valid." }),
  password: z.string().min(1, { error: "Password is required." }),
  department: z.string().min(1, { error: "Department is required." }),
  role: z.string().min(1, { error: "Role is required." }),
});
type RegisterSchema = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const form = useForm<RegisterSchema>({
    ...defaultFormConfig,
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      department: "",
      password: "",
      role: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterSchema> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="register-form">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-email"
                aria-invalid={fieldState.invalid}
                placeholder="user@acme.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="department"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-department">Department</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="form-department"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Department</SelectLabel>
                    <SelectItem value="humanResources">
                      Human Resources
                    </SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="businessIntelligence">
                      Business Intelligence
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="role"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-role">Role</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger id="form-role" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-password">Password</FieldLabel>
              <Input
                {...field}
                id="form-password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="••••••••"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
