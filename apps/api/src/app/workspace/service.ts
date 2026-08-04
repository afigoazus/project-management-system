import type { PrismaClient, Role } from "@workspace/database";
import type { CreateWorkspaceInput, AddWorkspaceMemberInput } from "./schema";

export class WorkspaceService {
  constructor(private db: PrismaClient) {}

  async createWorkspace(userId: string, input: CreateWorkspaceInput) {
    const { name, slug: customSlug } = input;
    const slugBase = customSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let slug = slugBase;
    let counter = 1;

    while (await this.db.workspace.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${counter++}`;
    }

    return this.db.workspace.create({
      data: {
        name,
        slug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "OWNER",
          },
        },
      },
      include: {
        members: true,
      },
    });
  }

  async getUserWorkspaces(userId: string) {
    return this.db.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getWorkspaceById(userId: string, workspaceId: string) {
    return this.db.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        projects: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  async getMemberRole(workspaceId: string, userId: string) {
    return this.db.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });
  }

  async findUserByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  async addMember(workspaceId: string, targetUserId: string, role: Role) {
    return this.db.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
      create: {
        workspaceId,
        userId: targetUserId,
        role,
      },
      update: {
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }
}
