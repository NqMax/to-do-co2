import { Header } from "@/features/workspace/components/Header";
import { WorkspaceTasks } from "@/features/workspace/components/WorkspaceTasks";

export function WorkspacePage() {
  return (
    <div className="h-screen w-full">
      <Header />
      <WorkspaceTasks />
    </div>
  );
}
