import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { taskRevisionsQueries } from "@/features/tasks/api/queries";
// import { TaskCard } from "@/features/tasks/components/TaskCard";
// import { NewTaskDialog } from "@/features/tasks/components/NewTaskDialog";
// import { ResourcePagination } from "@/components/ResourcePagination";
import { Spinner } from "@/components/ui/spinner";
// import { TaskToolbar } from "@/features/tasks/components/TaskToolbar";
import type { TaskQueryParams } from "@/features/tasks/types";

export function RevisionsPage() {
  const [searchParams] = useSearchParams();

  const result = useQuery(
    taskRevisionsQueries.list(
      Object.fromEntries(searchParams) as TaskQueryParams,
    ),
  );

  if (result.isPending) {
    return (
      <main className="flex h-[calc(100vh-3.75rem)] items-center justify-center">
        <Spinner className="size-10" />
      </main>
    );
  }

  if (result.isError) {
    return <span>Error: {result.error.message}</span>;
  }

  console.log({ revsions: result.data });

  return (
    <>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <p>Revisions </p>
        {/* <NewTaskDialog /> */}
      </h1>
      {/* <TaskToolbar isRefetching={result.isRefetching} />
      <ul className="flex flex-col gap-4 overflow-y-auto pr-2">
        {result.data.data.length === 0 ? (
          <li className="py-4 text-center">
            No tasks available under current filters.
          </li>
        ) : (
          result.data.data.map((task) => (
            <li key={task.id}>
              <TaskCard task={task} />
            </li>
          ))
        )}
      </ul>
      <ResourcePagination pagination={result.data.meta.pagination} /> */}
    </>
  );
}
