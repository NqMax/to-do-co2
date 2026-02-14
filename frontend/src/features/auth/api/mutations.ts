import { useMutation } from "@tanstack/react-query";
import {
  registerUser,
  validateUser,
  deleteSession,
} from "@/features/auth/api/requests";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: validateUser,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: deleteSession,
  });
}
