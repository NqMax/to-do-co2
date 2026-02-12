import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg";

export function WorkspaceSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-15 items-center justify-center border-b">
        <div className="flex items-center justify-center gap-2">
          <img src={Logo} alt="Logo" className="h-6 w-6" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
