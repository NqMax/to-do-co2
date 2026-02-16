import { Routes, Route } from "react-router";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { WorkspaceLayout } from "@/features/workspace/layouts/WorkspaceLayout";
import { AuthLayout } from "@/features/auth/layouts/AuthLayout";
import { RevisionsPage } from "@/features/workspace/components/RevisionsPage";
import { WorkspacePage } from "@/features/workspace/components/WorkspacePage";
import { NotFound } from "@/components/global-state/NotFound";

export function AppRouter() {
  return (
    <Routes>
      {/* Workspace */}
      <Route element={<AuthLayout />}>
        <Route element={<WorkspaceLayout />}>
          <Route path="/" element={<WorkspacePage />} />
          <Route path="/revisions" element={<RevisionsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
