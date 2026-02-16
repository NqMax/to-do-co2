import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "@/features/workspace/components/Header";
import { WorkspaceSidebar } from "@/features/workspace/components/WorkspaceSidebar";
import { Outlet } from "react-router";

export function WorkspaceLayout() {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />
      <div className="h-screen w-full">
        <Header />
        <main className="flex h-[calc(100vh-3.75rem)] flex-col gap-5 p-4">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
