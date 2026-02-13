import * as z from "zod";

export const loginDto = z.object({
  email: z.email({ error: "Email must be valid." }),
  password: z.string().min(1, { error: "Password is required." }),
});
export type LoginDto = z.infer<typeof loginDto>;
