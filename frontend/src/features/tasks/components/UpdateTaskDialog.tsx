import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { UpdateTaskForm } from "@/features/tasks/components/UpdateTaskForm";
import type { Task } from "@/features/tasks/types";

export function UpdateTaskDialog({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button>
          <PencilIcon className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
          <DialogDescription>
            Update an existing task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <UpdateTaskForm task={task} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
