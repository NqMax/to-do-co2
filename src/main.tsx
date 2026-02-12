import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { AppRouter } from "@/features/routing/AppRouter.tsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TooltipProvider>
        <AppRouter />
      </TooltipProvider>
    </BrowserRouter>
  </StrictMode>,
);
