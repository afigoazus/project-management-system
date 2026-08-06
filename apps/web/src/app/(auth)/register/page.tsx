import { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join Developer Workspace to manage projects and teams",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
