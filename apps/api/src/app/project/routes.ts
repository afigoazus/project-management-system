import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { createProjectSchema, createProjectParamsSchema, getProjectParamsSchema } from "./schema";
import { ProjectService } from "./service";
import { commonErrorResponses } from "../../lib/error-schemas";
import { forbidden, notFound } from "../../lib/http-response";

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
        description: "Creates a new project inside the specified workspace if the user is a workspace member.",
        params: createProjectParamsSchema,
        body: createProjectSchema,
        response: {
          201: Type.Object({ project: Type.Any() }, { description: "Project created successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const { workspaceId } = request.params;
      const userId = request.user!.id;
      const service = new ProjectService(fastify.db);

      const member = await service.checkWorkspaceMember(workspaceId, userId);
      if (!member) {
        return forbidden(reply, "You are not a member of this workspace");
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
        description: "Retrieves details of a project including workspace membership check.",
        params: getProjectParamsSchema,
        response: {
          200: Type.Object({ project: Type.Any() }, { description: "Project details" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new ProjectService(fastify.db);

      const project = await service.getProjectById(id, userId);
      if (!project) {
        return notFound(reply, "Project not found or access denied");
      }

      return reply.send({ project });
    }
  );
};

