import * as z from "zod";

export const createUserDto = z.object({
  email: z.email({ error: "Email must be valid." }).trim(),
  password: z.string().trim().min(1, { error: "Password is required." }),
  department: z.enum(["humanResources", "finance", "businessIntelligence"], {
    error: "Department is required.",
  }),
  role: z.enum(["standard", "supervisor"], { error: "Role is required." }),
});
export type CreateUserDto = z.infer<typeof createUserDto>;
