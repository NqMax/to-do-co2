import { Badge } from "@/components/ui/badge";
import { priorityLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";
import { UpdateTaskDialog } from "@/features/tasks/components/UpdateTaskDialog";
import { DeleteTaskDialog } from "@/features/tasks/components/DeleteTaskDialog";
import { CompleteTask } from "@/features/tasks/components/CompleteTask";
import { SignalLowIcon, SignalMediumIcon, SignalHighIcon } from "lucide-react";
import type { Task } from "@/features/tasks/types";

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-card text-card-foreground flex rounded-xl border shadow-sm">
      <div className="flex w-10 flex-col items-center justify-evenly">
        <CompleteTask task={task} />
        <UpdateTaskDialog task={task} />
        <DeleteTaskDialog task={task} />
      </div>
      <div className="flex w-full flex-col border-l">
        <div className="px-3 pt-2 pb-3">
          <p className="font-medium">{task.title}</p>
          <p className="text-sm">{task.description}</p>
        </div>
        <div className="bg-muted/50 flex items-center gap-2 rounded-br-xl border-t px-3 py-2">
          <Badge
            className={cn(
              {
                "bg-blue-400": task.priority === "low",
                "bg-orange-400": task.priority === "medium",
                "bg-red-400": task.priority === "high",
              },
              "flex w-15.25 justify-between",
            )}
          >
            {priorityLabels[task.priority]}
            {task.priority === "low" && <SignalLowIcon />}
            {task.priority === "medium" && <SignalMediumIcon />}
            {task.priority === "high" && <SignalHighIcon />}
          </Badge>
        </div>
      </div>
    </div>
  );
}
