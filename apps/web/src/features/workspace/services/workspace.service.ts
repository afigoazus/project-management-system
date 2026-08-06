import { apiFetch } from "@/lib/api";
import {
  WorkspaceItem,
  WorkspaceDetail,
  WorkspaceMember,
} from "../types/workspace.type";

export async function getWorkspaces(): Promise<WorkspaceItem[]> {
  const res = await apiFetch<{ workspaces: WorkspaceItem[] }>("/workspaces");
  return res.workspaces;
}

export async function getWorkspaceDetail(id: string): Promise<WorkspaceDetail> {
  const res = await apiFetch<{ workspace: WorkspaceDetail }>(`/workspaces/${id}`);
  return res.workspace;
}

export async function createWorkspace(data: { name: string; slug: string }): Promise<WorkspaceItem> {
  const res = await apiFetch<{ workspace: WorkspaceItem }>("/workspaces", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.workspace;
}

export async function addWorkspaceMember(workspaceId: string, email: string): Promise<WorkspaceMember> {
  const res = await apiFetch<{ member: WorkspaceMember }>(`/workspaces/${workspaceId}/members`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return res.member;
}
