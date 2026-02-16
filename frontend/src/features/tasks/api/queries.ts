import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getTasks } from "@/features/tasks/api/requests";
import type { TaskQueryParams } from "@/features/tasks/types";

export const taskQueries = {
  all: () => ["tasks"],
  lists: () => [...taskQueries.all(), "lists"],
  list: (filters: TaskQueryParams) =>
    queryOptions({
      queryKey: [...taskQueries.lists(), filters],
      queryFn: () => getTasks(filters),
      placeholderData: keepPreviousData,
    }),
};
