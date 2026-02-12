import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkspaceSidebar } from "@/features/workspace/components/WorkspaceSidebar";
import { Outlet } from "react-router";

export function WorkspaceLayout() {
  return (
    <SidebarProvider>
      <WorkspaceSidebar />
      <Outlet />
    </SidebarProvider>
  );
}
