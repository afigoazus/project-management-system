import { Metadata } from "next";
import { WorkspacesListContent } from "@/features/workspace/components";

export const metadata: Metadata = {
  title: "Workspaces",
  description: "Manage your developer workspaces and team members",
};

export default function WorkspacesPage() {
  return <WorkspacesListContent />;
}
