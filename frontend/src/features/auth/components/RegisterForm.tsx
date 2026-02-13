import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultFormConfig } from "@/config/formConfig";
import { useRegister } from "@/features/auth/api/mutations";
import {
  registerFormSchema,
  type RegisterFormSchema,
} from "@/features/auth/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
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

export function RegisterForm() {
  const registerMutation = useRegister();

  const form = useForm({
    ...defaultFormConfig,
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "standard" as const,
      department: "humanResources" as const,
    },
  });

  const onSubmit: SubmitHandler<RegisterFormSchema> = (data) => {
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
        <Button
          type="submit"
          className="w-full"
          disabled={registerMutation.isPending}
        >
          Register
          {registerMutation.isPending && <Spinner />}
        </Button>
      </FieldGroup>
    </form>
  );
}
