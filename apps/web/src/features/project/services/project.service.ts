import { apiFetch } from "@/lib/api";
import { ProjectDetail, CreateProjectPayload } from "../types/project.type";
import type { Task } from "@/features/task/types";

export async function getProjectDetail(id: string): Promise<ProjectDetail> {
  const res = await apiFetch<{ project: ProjectDetail }>(`/projects/${id}`);
  return res.project;
}

export async function getProjectTasks(id: string): Promise<Task[]> {
  const res = await apiFetch<{ tasks: Task[] }>(`/projects/${id}/tasks`);
  return res.tasks || [];
}

export async function createProject(data: CreateProjectPayload): Promise<ProjectDetail> {
  const res = await apiFetch<{ project: ProjectDetail }>("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.project;
}
