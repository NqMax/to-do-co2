import * as z from "zod";

export const registerFormSchema = z.object({
  email: z.email({ error: "Email must be valid." }).trim(),
  password: z
    .string()
    .trim()
    .min(1, { error: "Password is required." })
    .min(8, { error: "Password must be at least 8 characters long." }),
  confirmPassword: z
    .string()
    .trim()
    .min(1, { error: "Password confirmation is required." })
    .min(8, { error: "Password must be at least 8 characters long." }),
  department: z.enum(["humanResources", "finance", "businessIntelligence"], {
    error: "Department is required.",
  }),
  role: z.enum(["standard", "supervisor"], { error: "Role is required." }),
});
export type RegisterFormSchema = z.infer<typeof registerFormSchema>;
export type CreateUserDto = RegisterFormSchema;

export const loginSchema = z.object({
  email: z.email({ error: "Email must be valid." }).trim(),
  password: z.string().trim().min(1, { error: "Password is required." }),
});
export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginDto = LoginSchema;

export type AuthResponse = {
  id: string;
  email: string;
  department: CreateUserDto["department"];
  role: CreateUserDto["role"];
  createdAt: string;
};
