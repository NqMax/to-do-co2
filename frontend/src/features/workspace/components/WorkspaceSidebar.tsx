import { NavLink } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg";
import { Link } from "react-router";
import { ClipboardListIcon, FileStackIcon } from "lucide-react";

const sidebarItems = [
  {
    title: "Tasks",
    icon: ClipboardListIcon,
    href: "/",
  },
  {
    title: "Revisions",
    icon: FileStackIcon,
    href: "/revisions",
  },
];

export function WorkspaceSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-15 items-center justify-center border-b">
        <Link to="/">
          <div className="flex items-center justify-center gap-2">
            <img src={Logo} alt="Logo" className="h-6 w-6" />
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarItems.map((item, index) => (
              <SidebarMenuButton asChild key={index} tooltip={item.title}>
                <NavLink to={item.href} className="[&.active]:font-bold">
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
