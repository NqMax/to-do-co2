import { loadEnvFile } from "node:process";
import * as z from "zod";

loadEnvFile();

const envSchema = z.object({
  DATABASE_URL: z.string(),
});

envSchema.parse(process.env);
