import * as z from "zod";

export const registerFormSchema = z.object({
  email: z.email({ error: "Email must be valid." }),
  password: z.string().min(1, { error: "Password is required." }),
  department: z.enum(["humanResources", "finance", "businessIntelligence"], {
    error: "Department is required.",
  }),
  role: z.enum(["standard", "supervisor"], { error: "Role is required." }),
});
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type CreateUserDto = RegisterFormSchema;

export const loginSchema = z.object({
  email: z.email({ error: "Email must be valid." }),
  password: z.string().min(1, { error: "Password is required." }),
});
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginDto = LoginSchema;

export type AuthResponse = {
  id: string;
  email: string;
  department: CreateUserDto["department"];
  role: CreateUserDto["role"];
  token: string;
};
