import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { createProjectSchema, createProjectParamsSchema, getProjectParamsSchema } from "./schema";
import { ProjectService } from "./service";

export const projectRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.addHook("onRequest", fastify.authenticate);

  // 1. Create Project
  app.post(
    "/workspaces/:workspaceId/projects",
    {
      schema: {
        tags: ["Project"],
        summary: "Create a project in a workspace",
        params: createProjectParamsSchema,
        body: createProjectSchema,
      },
    },
    async (request, reply) => {
      const { workspaceId } = request.params;
      const userId = request.user!.id;
      const service = new ProjectService(fastify.db);

      const member = await service.checkWorkspaceMember(workspaceId, userId);
      if (!member) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You are not a member of this workspace",
        });
      }

      const project = await service.createProject(workspaceId, request.body);
      return reply.status(201).send({ project });
    }
  );

  // 2. Get Project Detail
  app.get(
    "/projects/:id",
    {
      schema: {
        tags: ["Project"],
        summary: "Get project detail by ID",
        params: getProjectParamsSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new ProjectService(fastify.db);

      const project = await service.getProjectById(id, userId);
      if (!project) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Project not found or access denied",
        });
      }

      return reply.send({ project });
    }
  );
};

