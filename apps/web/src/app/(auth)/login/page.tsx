import { Metadata } from "next";
import { LoginForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Developer Workspace account",
};

export default function LoginPage() {
  return <LoginForm />;
}
