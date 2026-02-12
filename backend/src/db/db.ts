import { drizzle } from "drizzle-orm/node-postgres";
import "@/lib/env";

export const db = drizzle(process.env.DATABASE_URL!);
