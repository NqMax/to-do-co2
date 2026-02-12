import { Routes, Route } from "react-router";
import App from "@/App";
import { LoginPage } from "@/features/auth/components/LoginPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
