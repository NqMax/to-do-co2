import { useMutation } from "@tanstack/react-query";
import {
  createTask,
  updateTask,
  deleteTask,
} from "@/features/tasks/api/requests";
import type { CreateTaskDto, UpdateTaskDto } from "@/features/tasks/types";

export function useCreateTask() {
  return useMutation({
    mutationFn: async (data: CreateTaskDto) => {
      const response = await createTask(data);
      return response;
    },
  });
}

export function useUpdateTask(taskId: string | number) {
  return useMutation({
    mutationFn: async (data: UpdateTaskDto) => {
      const response = await updateTask(taskId, data);
      return response;
    },
  });
}

export function useDeleteTask(taskId: string | number) {
  return useMutation({
    mutationFn: async () => {
      const response = await deleteTask(taskId);
      return response;
    },
  });
}
