import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderIcon } from "lucide-react";
import { NewTaskDialog } from "@/features/tasks/components/NewTaskDialog";

export function EmptyTask() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Tasks Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any tasks yet. Get started by creating your
          first task.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <div className="flex items-center gap-2 rounded-xl border px-2 py-2">
          <span className="font-medium text-base">Create a task</span>
          <NewTaskDialog />
        </div>
      </EmptyContent>
    </Empty>
  );
}
