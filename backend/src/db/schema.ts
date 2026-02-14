import {
  integer,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  salt: varchar().notNull(),
  department: varchar()
    .notNull()
    .references(() => departments.name),
  role: varchar()
    .notNull()
    .references(() => roles.name),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

const statusEnum = pgEnum("taskStatus", ["pending", "inProgress", "completed"]);
const priorityEnum = pgEnum("taskPriority", ["low", "medium", "high"]);
export const task = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  status: statusEnum().notNull(),
  priority: priorityEnum().notNull(),
  createdBy: integer().references(() => usersTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const departments = pgTable("departments", {
  name: varchar().primaryKey(),
});

export const roles = pgTable("roles", {
  name: varchar().primaryKey(),
});
