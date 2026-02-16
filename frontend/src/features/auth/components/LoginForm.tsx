import { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { defaultFormConfig } from "@/config/formConfig";
import { useLogin } from "@/features/auth/api/mutations";
import { loginSchema, type LoginSchema } from "@/features/auth/types";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const loginMutation = useLogin();
  const navigate = useNavigate();

  const form = useForm({
    ...defaultFormConfig,
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    loginMutation.mutate(data, {
      onSuccess: () => navigate("/"),
    });
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
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id="form-password"
                  type={isPasswordVisible ? "text" : "password"}
                  aria-invalid={fieldState.invalid}
                  placeholder="••••••••"
                  className="rounded-md"
                />
                <InputGroupAddon
                  className="cursor-pointer"
                  align="inline-end"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeIcon /> : <EyeOffIcon />}
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            Login
            {loginMutation.isPending && <Spinner />}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
