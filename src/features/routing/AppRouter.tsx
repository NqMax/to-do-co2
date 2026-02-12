import App from "@/App";
import { Routes, Route } from "react-router";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
    </Routes>
  );
}
