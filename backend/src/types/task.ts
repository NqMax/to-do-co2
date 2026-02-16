import * as z from "zod";

const queryValueToString = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

const queryValueToNumber = (value: unknown) => {
  const resolvedValue = queryValueToString(value);

  if (typeof resolvedValue === "number") {
    return resolvedValue;
  }

  if (typeof resolvedValue !== "string") {
    return undefined;
  }

  const trimmed = resolvedValue.trim();

  if (!trimmed) {
    return undefined;
  }

  const numberValue = Number(trimmed);

  return Number.isNaN(numberValue) ? undefined : numberValue;
};

const queryValueToOptionalString = (value: unknown) => {
  const resolvedValue = queryValueToString(value);

  if (typeof resolvedValue !== "string") {
    return undefined;
  }

  const trimmed = resolvedValue.trim();

  return trimmed.length ? trimmed : undefined;
};

export const taskStatusSchema = z.enum(["pending", "inProgress", "completed"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskDto = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z.string().trim().min(1, { error: "Description is required." }),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema,
});

export const updateTaskDto = createTaskDto
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    error: "At least one field is required to update a task.",
  });

export const getTasksQueryDto = z.object({
  page: z.preprocess(queryValueToNumber, z.int().min(1).default(1)),
  pageSize: z.preprocess(
    queryValueToNumber,
    z.int().min(1).max(100).default(10),
  ),
  priority: z
    .preprocess(queryValueToString, z.enum(["low", "medium", "high"]))
    .optional(),
  status: z
    .preprocess(
      queryValueToString,
      z.enum(["pending", "inProgress", "completed"]),
    )
    .optional(),
  sortOrder: z
    .preprocess(queryValueToString, z.enum(["asc", "desc"]))
    .optional(),
  search: z
    .preprocess(queryValueToOptionalString, z.string().max(200))
    .optional(),
});

export const taskIdParamDto = z.object({
  id: z.coerce.number().int().min(1),
});

export const taskRevisionIdParamDto = z.object({
  id: z.coerce.number().int().min(1),
});

export type CreateTaskDto = z.infer<typeof createTaskDto>;
export type UpdateTaskDto = z.infer<typeof updateTaskDto>;
export type GetTasksQueryDto = z.infer<typeof getTasksQueryDto>;
export type TaskIdParamDto = z.infer<typeof taskIdParamDto>;
export type TaskRevisionIdParamDto = z.infer<typeof taskRevisionIdParamDto>;
