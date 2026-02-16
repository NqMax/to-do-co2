import * as z from "zod";
import { departmentEnum } from "@/db/schema";

export const loginDto = z.object({
  email: z.email({ error: "Email must be valid." }).trim(),
  password: z.string().trim().min(1, { error: "Password is required." }),
});
export type LoginDto = z.infer<typeof loginDto>;

export type JwtPayload = {
  id: number;
  department: (typeof departmentEnum.enumValues)[number];
  departmentId: number;
  role: string;
};
