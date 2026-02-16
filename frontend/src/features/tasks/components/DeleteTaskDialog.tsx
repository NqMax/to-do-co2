import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTask } from "@/features/tasks/api/mutations";
import { taskQueries } from "@/features/tasks/api/queries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { Task } from "@/features/tasks/types";

export function DeleteTaskDialog({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const deleteTaskMutation = useDeleteTask(task.id);

  function handleDelete() {
    deleteTaskMutation.mutate(undefined, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: taskQueries.lists() });
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Trash2Icon className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action could be permament.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
          >
            Delete
            {deleteTaskMutation.isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
