import * as z from "zod";

export const loginDto = z.object({
  email: z.email({ error: "Email must be valid." }).trim(),
  password: z.string().trim().min(1, { error: "Password is required." }),
});
export type LoginDto = z.infer<typeof loginDto>;

export type JwtPayload = {
  id: number;
  department: string;
  role: string;
};
