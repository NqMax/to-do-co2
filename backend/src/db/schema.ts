import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  salt: varchar().notNull(),
  department: varchar().notNull().references(() => departments.name),
  role: varchar().notNull().references(() => roles.name),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const departments = pgTable("departments", {
  name: varchar().primaryKey(),
});

export const roles = pgTable("roles", {
  name: varchar().primaryKey(),
});
