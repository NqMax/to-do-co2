import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserInfo } from "@/features/workspace/components/UserInfo";

export function WorkspacePage() {
  return (
    <main className="w-full">
      <header className="bg-sidebar flex h-15 items-center justify-between border-b p-2">
        <SidebarTrigger />
        <UserInfo />
      </header>
    </main>
  );
}
