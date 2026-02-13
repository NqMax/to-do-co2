import { Routes, Route } from "react-router";
import { LoginPage } from "@/features/auth/components/LoginPage";
import { RegisterPage } from "@/features/auth/components/RegisterPage";
import { WorkspaceLayout } from "@/features/workspace/layouts/WorkspaceLayout";
import { WorkspacePage } from "@/features/workspace/components/WorkspacePage";

export function AppRouter() {
  return (
    <Routes>
      {/* Workspace */}
      <Route element={<WorkspaceLayout />}>
        <Route path="/" element={<WorkspacePage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
