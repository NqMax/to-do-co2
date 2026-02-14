import { create } from "zustand";
import type { AuthResponse } from "@/features/auth/types";

type State = {
  user: AuthResponse;
};
type Action = {
  updateUser: (user: AuthResponse) => void;
  clearUser: () => void;
};
type Store = State & Action;

const defaultUser: AuthResponse = {
  id: "",
  email: "",
  department: "humanResources",
  role: "standard",
  createdAt: "",
};

export const useUserStore = create<Store>((set) => ({
  user: defaultUser,
  updateUser: (user) => set({ user }),
  clearUser: () => set({ user: defaultUser }),
}));
