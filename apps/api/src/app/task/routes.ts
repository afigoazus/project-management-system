import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import {
  createTaskSchema,
  updateTaskSchema,
  reorderTaskSchema,
  getProjectTasksParamsSchema,
  taskParamsSchema,
} from "./schema";
import { TaskService } from "./service";

export const taskRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.addHook("onRequest", fastify.authenticate);

  // 1. Get Project Tasks
  app.get(
    "/projects/:projectId/tasks",
    {
      schema: {
        tags: ["Task"],
        summary: "Get all tasks for a project",
        params: getProjectTasksParamsSchema,
      },
    },
    async (request, reply) => {
      const { projectId } = request.params;
      const userId = request.user!.id;
      const service = new TaskService(fastify.db);

      const hasAccess = await service.checkProjectAccess(projectId, userId);
      if (!hasAccess) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You do not have access to this project",
        });
      }

      const tasks = await service.getTasksByProjectId(projectId);
      return reply.send({ tasks });
    }
  );

  // 2. Create Task
  app.post(
    "/projects/:projectId/tasks",
    {
      schema: {
        tags: ["Task"],
        summary: "Create a task in a project",
        params: getProjectTasksParamsSchema,
        body: createTaskSchema,
      },
    },
    async (request, reply) => {
      const { projectId } = request.params;
      const userId = request.user!.id;
      const service = new TaskService(fastify.db);

      const hasAccess = await service.checkProjectAccess(projectId, userId);
      if (!hasAccess) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You do not have access to this project",
        });
      }

      const task = await service.createTask(projectId, userId, request.body);
      return reply.status(201).send({ task });
    }
  );

  // 3. Update Task
  app.patch(
    "/tasks/:id",
    {
      schema: {
        tags: ["Task"],
        summary: "Update task details",
        params: taskParamsSchema,
        body: updateTaskSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new TaskService(fastify.db);

      const existingTask = await service.getTaskById(id);
      if (!existingTask) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Task not found",
        });
      }

      const hasAccess = await service.checkProjectAccess(existingTask.projectId, userId);
      if (!hasAccess) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You do not have access to this project",
        });
      }

      const task = await service.updateTask(id, request.body);
      return reply.send({ task });
    }
  );

  // 4. Reorder / Move Task Status & Position
  app.patch(
    "/tasks/:id/reorder",
    {
      schema: {
        tags: ["Task"],
        summary: "Reorder task position or status",
        params: taskParamsSchema,
        body: reorderTaskSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new TaskService(fastify.db);

      const existingTask = await service.getTaskById(id);
      if (!existingTask) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Task not found",
        });
      }

      const hasAccess = await service.checkProjectAccess(existingTask.projectId, userId);
      if (!hasAccess) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You do not have access to this project",
        });
      }

      const task = await service.reorderTask(id, request.body);
      return reply.send({ task });
    }
  );

  // 5. Delete Task
  app.delete(
    "/tasks/:id",
    {
      schema: {
        tags: ["Task"],
        summary: "Delete a task",
        params: taskParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new TaskService(fastify.db);

      const existingTask = await service.getTaskById(id);
      if (!existingTask) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Task not found",
        });
      }

      const hasAccess = await service.checkProjectAccess(existingTask.projectId, userId);
      if (!hasAccess) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You do not have access to this project",
        });
      }

      await service.deleteTask(id);
      return reply.send({ message: "Task deleted successfully" });
    }
  );
};
