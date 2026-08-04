import type { PrismaClient } from "@workspace/database";
import type { CreateProjectInput } from "./schema";

export class ProjectService {
  constructor(private db: PrismaClient) {}

  async checkWorkspaceMember(workspaceId: string, userId: string) {
    return this.db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  async createProject(workspaceId: string, input: CreateProjectInput) {
    return this.db.project.create({
      data: {
        name: input.name,
        description: input.description || null,
        githubRepoUrl: input.githubRepoUrl || null,
        workspaceId,
      },
    });
  }

  async getProjectById(projectId: string, userId: string) {
    return this.db.project.findFirst({
      where: {
        id: projectId,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
  }
}
