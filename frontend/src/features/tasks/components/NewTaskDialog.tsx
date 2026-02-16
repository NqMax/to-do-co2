import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SquarePlusIcon } from "lucide-react";
import { NewTaskForm } from "@/features/tasks/components/NewTaskForm";

export function NewTaskDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="size-8 border">
          <SquarePlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
          <DialogDescription>
            Create a new task here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <NewTaskForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
