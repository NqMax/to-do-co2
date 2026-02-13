import { QueryProvider } from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </QueryProvider>
  );
}
