import * as z from "zod";

export const taskStatusSchema = z.enum(["pending", "inProgress", "completed"]);
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export const createTaskFormSchema = z.object({
  title: z.string().trim().min(1, { error: "Title is required." }),
  description: z.string().trim().min(1, { error: "Description is required." }),
  priority: taskPrioritySchema,
});
export type CreateTaskFormSchema = z.infer<typeof createTaskFormSchema>;
export type CreateTaskDto = CreateTaskFormSchema;

export type UpdateTaskDto = Partial<
  CreateTaskDto & {
    status?: z.infer<typeof taskStatusSchema>;
  }
>;

export type TaskQueryParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  priority?: z.infer<typeof taskPrioritySchema>;
  status?: z.infer<typeof taskStatusSchema>;
  sortOrder?: "asc" | "desc";
};

export type Task = {
  id: number;
  title: string;
  description: string;
  priority: z.infer<typeof taskPrioritySchema>;
  status: z.infer<typeof taskStatusSchema>;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
};

export type TaskRevision = {
  id: number;
  taskId: number | null;
  payload: Partial<Task>;
  action: "delete" | "create" | "update" | "complete";
  requestedBy: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type Pagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type Metadata = {
  meta: {
    pagination: Pagination;
    filters: {
      priority: z.infer<typeof taskPrioritySchema> | null;
      status: z.infer<typeof taskStatusSchema> | null;
    };
    sort: { order: "asc" | "desc" };
    search: string | null;
  };
};

export type TasksResponse = {
  data: Task[];
  meta: Metadata["meta"];
};

export type TaskRevisionsResponse = {
  data: TaskRevision[];
  meta: Metadata["meta"];
};

export type TaskRevisionAction = "delete" | "create" | "update" | "complete";
export type TaskRevisionStatus = "pending" | "approved" | "rejected";
export type TaskRevisionResponse = {
  id: number;
  action: TaskRevisionAction;
  status: TaskRevisionStatus;
  taskId: number | null;
  createdAt: string;
};

export type TaskMutationResponse = Task | TaskRevisionResponse;

export function isTaskRevisionResponse(
  value: TaskMutationResponse,
): value is TaskRevisionResponse {
  return "action" in value && "taskId" in value && "status" in value;
}
