import { signIn, signUp } from "@/lib/auth-client";
import { LoginCredentials, RegisterCredentials } from "../types/auth.type";

export async function loginWithEmail(credentials: LoginCredentials) {
  const res = await signIn.email({
    email: credentials.email,
    password: credentials.password,
  });

  if (res.error) {
    throw new Error(res.error.message || "Invalid credentials");
  }

  return res.data;
}

export async function registerWithEmail(credentials: RegisterCredentials) {
  const res = await signUp.email({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  });

  if (res.error) {
    throw new Error(res.error.message || "Registration failed");
  }

  return res.data;
}

export async function loginWithGithub() {
  const res = await signIn.social({
    provider: "github",
    callbackURL: `${window.location.origin}/workspaces`,
  });

  if (res.error) {
    throw new Error(res.error.message || "Failed to sign in with GitHub");
  }

  return res.data;
}
