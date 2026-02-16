import { client } from "@/lib/httpClient";
import type { AxiosResponse } from "axios";
import type {
  CreateTaskDto,
  Task,
  TaskMutationResponse,
  TasksResponse,
  TaskQueryParams,
  UpdateTaskDto,
  TaskRevisionsResponse,
} from "@/features/tasks/types";

export async function createTask(data: CreateTaskDto) {
  const response = await client.post<
    TaskMutationResponse,
    AxiosResponse<TaskMutationResponse>,
    CreateTaskDto
  >("/tasks", data);
  return response.data;
}

export async function updateTask(
  taskId: string | number,
  data: Partial<UpdateTaskDto>,
) {
  const response = await client.put<
    TaskMutationResponse,
    AxiosResponse<TaskMutationResponse>,
    Partial<UpdateTaskDto>
  >(`/tasks/${taskId}`, data);
  return response.data;
}

export async function getTasks(filters: TaskQueryParams) {
  const response = await client.get<TasksResponse>("/tasks", {
    params: filters,
  });
  return response.data;
}

export async function deleteTask(taskId: string | number) {
  const response = await client.delete(`/tasks/${taskId}`);
  return response.data;
}

export async function toggleTaskCompletion(task: Task) {
  const newStatus = task.status === "completed" ? "pending" : "completed";

  const response = await client.put<
    TaskMutationResponse,
    AxiosResponse<TaskMutationResponse>,
    Partial<UpdateTaskDto>
  >(`/tasks/${task.id}`, { status: newStatus });
  return response.data;
}

export async function getTaskRevisions(filters: TaskQueryParams) {
  const response = await client.get<TaskRevisionsResponse>("/tasks/revisions", {
    params: filters,
  });
  return response.data;
}
