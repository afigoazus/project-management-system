import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import {
  createTaskSchema,
  updateTaskSchema,
  reorderTaskSchema,
  getProjectTasksParamsSchema,
  taskParamsSchema,
} from "./schema";
import { taskController } from "./controller";
import { commonErrorResponses } from "../../lib/error-schemas";

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
        description: "Retrieves all tasks associated with a specific project if the user has access.",
        params: getProjectTasksParamsSchema,
        response: {
          200: Type.Object({ status: Type.String(), message: Type.String(), tasks: Type.Array(Type.Any()) }, { description: "List of project tasks" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => taskController.getTasksByProjectId(request, reply, fastify)
  );

  // 2. Create Task
  app.post(
    "/projects/:projectId/tasks",
    {
      schema: {
        tags: ["Task"],
        summary: "Create a task in a project",
        description: "Creates a new task in the specified project.",
        params: getProjectTasksParamsSchema,
        body: createTaskSchema,
        response: {
          201: Type.Object({ status: Type.String(), message: Type.String(), task: Type.Any() }, { description: "Task created successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => taskController.createTask(request, reply, fastify)
  );

  // 3. Update Task
  app.patch(
    "/tasks/:id",
    {
      schema: {
        tags: ["Task"],
        summary: "Update task details",
        description: "Updates an existing task's title, description, status, priority, or assignee.",
        params: taskParamsSchema,
        body: updateTaskSchema,
        response: {
          200: Type.Object({ status: Type.String(), message: Type.String(), task: Type.Any() }, { description: "Task updated successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => taskController.updateTask(request, reply, fastify)
  );

  // 4. Reorder / Move Task Status & Position
  app.patch(
    "/tasks/:id/reorder",
    {
      schema: {
        tags: ["Task"],
        summary: "Reorder task position or status",
        description: "Moves a task to a new Kanban column (status) or reorders its position index.",
        params: taskParamsSchema,
        body: reorderTaskSchema,
        response: {
          200: Type.Object({ status: Type.String(), message: Type.String(), task: Type.Any() }, { description: "Task reordered successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => taskController.reorderTask(request, reply, fastify)
  );

  // 5. Delete Task
  app.delete(
    "/tasks/:id",
    {
      schema: {
        tags: ["Task"],
        summary: "Delete a task",
        description: "Deletes a task by ID.",
        params: taskParamsSchema,
        response: {
          200: Type.Object({ status: Type.String(), message: Type.String() }, { description: "Task deleted successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => taskController.deleteTask(request, reply, fastify)
  );
};
