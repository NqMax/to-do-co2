import { useMutation } from "@tanstack/react-query";
import { registerUser, validateUser } from "@/features/auth/api/requests";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log({ data });
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: validateUser,
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log({ data });
    },
  });
}
