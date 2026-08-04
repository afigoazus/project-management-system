import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { TaskService } from "./service";
import type { CreateTaskInput, UpdateTaskInput, ReorderTaskInput } from "./schema";
import { forbidden, notFound, sendSuccess } from "../../lib/http-response";

export class TaskController {
  private service(fastify: FastifyInstance) {
    return new TaskService(fastify.db);
  }

  async getTasksByProjectId(
    request: FastifyRequest<{ Params: { projectId: string } }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { projectId } = request.params;
    const userId = request.user!.id;
    const service = this.service(fastify);

    const hasAccess = await service.checkProjectAccess(projectId, userId);
    if (!hasAccess) {
      return forbidden(reply, "You do not have access to this project");
    }

    const tasks = await service.getTasksByProjectId(projectId);
    return sendSuccess(reply, 200, "Tasks retrieved successfully", "tasks", tasks);
  }

  async createTask(
    request: FastifyRequest<{ Params: { projectId: string }; Body: CreateTaskInput }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { projectId } = request.params;
    const userId = request.user!.id;
    const service = this.service(fastify);

    const hasAccess = await service.checkProjectAccess(projectId, userId);
    if (!hasAccess) {
      return forbidden(reply, "You do not have access to this project");
    }

    const task = await service.createTask(projectId, userId, request.body);
    return sendSuccess(reply, 201, "Task created successfully", "task", task);
  }

  async updateTask(
    request: FastifyRequest<{ Params: { id: string }; Body: UpdateTaskInput }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { id } = request.params;
    const userId = request.user!.id;
    const service = this.service(fastify);

    const existingTask = await service.getTaskById(id);
    if (!existingTask) {
      return notFound(reply, "Task not found");
    }

    const hasAccess = await service.checkProjectAccess(existingTask.projectId, userId);
    if (!hasAccess) {
      return forbidden(reply, "You do not have access to this project");
    }

    const task = await service.updateTask(id, request.body);
    return sendSuccess(reply, 200, "Task updated successfully", "task", task);
  }

  async reorderTask(
    request: FastifyRequest<{ Params: { id: string }; Body: ReorderTaskInput }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { id } = request.params;
    const userId = request.user!.id;
    const service = this.service(fastify);

    const existingTask = await service.getTaskById(id);
    if (!existingTask) {
      return notFound(reply, "Task not found");
    }

    const hasAccess = await service.checkProjectAccess(existingTask.projectId, userId);
    if (!hasAccess) {
      return forbidden(reply, "You do not have access to this project");
    }

    const task = await service.reorderTask(id, request.body);
    return sendSuccess(reply, 200, "Task reordered successfully", "task", task);
  }

  async deleteTask(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { id } = request.params;
    const userId = request.user!.id;
    const service = this.service(fastify);

    const existingTask = await service.getTaskById(id);
    if (!existingTask) {
      return notFound(reply, "Task not found");
    }

    const hasAccess = await service.checkProjectAccess(existingTask.projectId, userId);
    if (!hasAccess) {
      return forbidden(reply, "You do not have access to this project");
    }

    await service.deleteTask(id);
    return sendSuccess(reply, 200, "Task deleted successfully");
  }
}

export const taskController = new TaskController();
