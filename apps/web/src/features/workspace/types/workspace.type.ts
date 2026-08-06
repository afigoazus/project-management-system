export interface WorkspaceItem {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  _count: {
    projects: number;
    members: number;
  };
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface WorkspaceProject {
  id: string;
  name: string;
  description?: string;
  githubRepoUrl?: string;
  createdAt: string;
}

export interface WorkspaceDetail extends WorkspaceItem {
  members: WorkspaceMember[];
  projects: WorkspaceProject[];
}
