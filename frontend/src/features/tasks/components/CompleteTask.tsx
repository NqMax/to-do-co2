import { useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateTask } from "@/features/tasks/api/mutations";
import { Spinner } from "@/components/ui/spinner";
import { taskQueries } from "@/features/tasks/api/queries";
import type { Task } from "@/features/tasks/types";

export function CompleteTask({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const updateTaskMutation = useUpdateTask(task.id);

  function toggleCompletion() {
    const newStatus = task.status === "completed" ? "pending" : "completed";

    updateTaskMutation.mutate(
      { status: newStatus },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: taskQueries.lists(),
          });
        },
      },
    );
  }

  if (updateTaskMutation.isPending) {
    return <Spinner />;
  }

  return (
    <Checkbox
      disabled={updateTaskMutation.isPending}
      checked={task.status === "completed"}
      onCheckedChange={toggleCompletion}
    />
  );
}
