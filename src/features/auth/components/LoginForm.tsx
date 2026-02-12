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

const loginSchema = z.object({
  email: z.email({ error: "Email must be valid." }),
  password: z.string().min(1, { error: "Password is required." }),
});
type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm({
    ...defaultFormConfig,
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} id="login-form">
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
