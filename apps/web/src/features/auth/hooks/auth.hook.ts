import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWithEmail, registerWithEmail, loginWithGithub } from "../services/auth.service";
import { LoginCredentials, RegisterCredentials } from "../types/auth.type";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginWithEmail(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerWithEmail(credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}

export function useGithubLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithGithub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.session() });
    },
  });
}
