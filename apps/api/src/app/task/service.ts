import type { PrismaClient } from "@workspace/database";
import type { CreateTaskInput, UpdateTaskInput, ReorderTaskInput } from "./schema";

export class TaskService {
  constructor(private db: PrismaClient) {}

  async checkProjectAccess(projectId: String, userId: string) {
    const project = await this.db.project.findFirst({
      where: {
        id: projectId as string,
        workspace: {
          members: {
            some: {
              userId,
            },
          },
        },
      },
    });

    return !!project;
  }

  async getTasksByProjectId(projectId: string) {
    return this.db.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        labels: true,
        checklists: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  }

  async createTask(projectId: string, createdById: string, input: CreateTaskInput) {
    // Generate initial position as the end of the column if position not given
    const lastTask = await this.db.task.findFirst({
      where: {
        projectId,
        status: input.status || "TODO",
      },
      orderBy: {
        position: "desc",
      },
    });

    const position = lastTask ? lastTask.position + 65535 : 65535;

    return this.db.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status || "TODO",
        priority: input.priority || "MEDIUM",
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        position,
        projectId,
        createdById,
        assigneeId: input.assigneeId || null,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        labels: true,
        checklists: true,
      },
    });
  }

  async updateTask(id: string, input: UpdateTaskInput) {
    return this.db.task.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.priority !== undefined && { priority: input.priority }),
        ...(input.dueDate !== undefined && { dueDate: input.dueDate ? new Date(input.dueDate) : null }),
        ...(input.assigneeId !== undefined && { assigneeId: input.assigneeId }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        labels: true,
        checklists: true,
      },
    });
  }

  async reorderTask(id: string, input: ReorderTaskInput) {
    return this.db.task.update({
      where: { id },
      data: {
        status: input.status,
        position: input.position,
      },
    });
  }

  async deleteTask(id: string) {
    return this.db.task.delete({
      where: { id },
    });
  }

  async getTaskById(id: string) {
    return this.db.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            workspaceId: true,
          },
        },
      },
    });
  }
}
