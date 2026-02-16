import { useMutation } from "@tanstack/react-query";
import {
  createTask,
  updateTask,
  deleteTask,
} from "@/features/tasks/api/requests";
import { toast } from "sonner";
import { isTaskRevisionResponse } from "@/features/tasks/types";
import type { CreateTaskDto, UpdateTaskDto } from "@/features/tasks/types";

export function useCreateTask() {
  return useMutation({
    mutationFn: async (data: CreateTaskDto) => {
      const response = await createTask(data);
      return response;
    },
    onSuccess: (data) => {
      if (isTaskRevisionResponse(data)) {
        toast.info("Task creation submitted for approval.");
      }
    },
  });
}

export function useUpdateTask(taskId: string | number) {
  return useMutation({
    mutationFn: async (data: UpdateTaskDto) => {
      const response = await updateTask(taskId, data);
      return response;
    },
    onSuccess: (data) => {
      if (isTaskRevisionResponse(data)) {
        toast.info("Task update submitted for approval.");
      }
    },
  });
}

export function useDeleteTask(taskId: string | number) {
  return useMutation({
    mutationFn: async () => {
      const response = await deleteTask(taskId);
      return response;
    },
    onSuccess: (data) => {
      if (isTaskRevisionResponse(data)) {
        toast.info("Task deletion submitted for approval.");
      }
    },
  });
}
