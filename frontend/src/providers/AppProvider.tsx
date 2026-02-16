import { QueryProvider } from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </QueryProvider>
  );
}
