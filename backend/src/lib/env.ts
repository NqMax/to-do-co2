import { loadEnvFile } from "node:process";
import * as z from "zod";

loadEnvFile();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

envSchema.parse(process.env);
