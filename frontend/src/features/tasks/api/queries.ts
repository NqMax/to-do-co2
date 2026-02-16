import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getTasks, getTaskRevisions } from "@/features/tasks/api/requests";
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

export const taskRevisionsQueries = {
  all: () => ["taskRevisions"],
  list: (filters: TaskQueryParams) =>
    queryOptions({
      queryKey: [...taskRevisionsQueries.all(), filters],
      queryFn: () => getTaskRevisions(filters),
      placeholderData: keepPreviousData,
    }),
};
