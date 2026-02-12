import { SidebarTrigger } from "@/components/ui/sidebar";

export function WorkspacePage() {
  return (
    <main className="w-full">
      <header className="bg-sidebar flex h-15 items-center border-b p-2">
        <SidebarTrigger />
      </header>
    </main>
  );
}
