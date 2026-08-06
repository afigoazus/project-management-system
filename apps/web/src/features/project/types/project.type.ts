export interface ProjectDetail {
  id: string;
  name: string;
  description?: string;
  githubRepoUrl?: string;
  createdAt: string;
  updatedAt: string;
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateProjectPayload {
  workspaceId: string;
  name: string;
  description?: string;
  githubRepoUrl?: string;
}
