import {
  integer,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
  salt: varchar().notNull(),
  department: integer()
    .notNull()
    .references(() => departmentsTable.id),
  role: integer()
    .notNull()
    .references(() => rolesTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const statusEnum = pgEnum("taskStatus", [
  "pending",
  "inProgress",
  "completed",
]);
export const priorityEnum = pgEnum("taskPriority", ["low", "medium", "high"]);
export const tasksTable = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  description: varchar().notNull(),
  status: statusEnum().notNull().default("pending"),
  department: integer()
    .notNull()
    .references(() => departmentsTable.id),
  priority: priorityEnum().notNull(),
  createdBy: integer()
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const actionEnum = pgEnum("revisionAction", [
  "create",
  "update",
  "delete",
]);
export const revisionStatusEnum = pgEnum("revisionStatus", [
  "pending",
  "approved",
  "rejected",
]);
export const tasksRevisionTable = pgTable("tasksRevision", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  taskId: integer().references(() => tasksTable.id),
  departmentId: integer()
    .notNull()
    .references(() => departmentsTable.id),
  payload: jsonb().notNull(),
  action: actionEnum().notNull(),
  requestedBy: integer()
    .notNull()
    .references(() => usersTable.id),
  status: revisionStatusEnum().notNull().default("pending"),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const departmentEnum = pgEnum("department", [
  "humanResources",
  "finance",
  "businessIntelligence",
]);
export const departmentsTable = pgTable("departments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: departmentEnum().notNull().unique(),
});

export const rolesEnum = pgEnum("role", ["standard", "supervisor"]);
export const rolesTable = pgTable("roles", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: rolesEnum().notNull().unique(),
});
