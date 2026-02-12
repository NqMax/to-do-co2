import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  department: varchar().references(() => departments.name),
  role: varchar().references(() => roles.name),
  createdAt: timestamp().defaultNow(),
});

export const departments = pgTable("departments", {
  name: varchar().primaryKey(),
});

export const roles = pgTable("roles", {
  name: varchar().primaryKey(),
});
