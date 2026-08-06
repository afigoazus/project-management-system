import { Metadata } from "next";
import { ProjectDetailContent } from "@/features/project/components";
import { getProjectDetail } from "@/features/project/services/project.service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const project = await getProjectDetail(id);
    return {
      title: project ? `${project.name}` : "Project Detail",
      description: project?.description || `Project detail dashboard for ${project?.name || "project"}`,
    };
  } catch {
    return {
      title: "Project Detail",
      description: "Project dashboard and task management",
    };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ProjectDetailContent projectId={id} />;
}
