import { Metadata } from "next";
import { WorkspaceDetailContent } from "@/features/workspace/components";
import { getWorkspaceDetail } from "@/features/workspace/services/workspace.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const workspace = await getWorkspaceDetail(id);
    return {
      title: workspace ? `${workspace.name}` : "Workspace Detail",
      description: `Manage projects and members of ${workspace?.name || "workspace"}`,
    };
  } catch {
    return {
      title: "Workspace Detail",
      description: "Workspace detail and project management",
    };
  }
}

export default async function WorkspaceDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <WorkspaceDetailContent workspaceId={id} />;
}
