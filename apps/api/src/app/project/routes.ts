import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { createProjectSchema, createProjectParamsSchema, getProjectParamsSchema } from "./schema";
import { projectController } from "./controller";
import { commonErrorResponses } from "../../lib/error-schemas";

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
          201: Type.Object({ status: Type.String(), message: Type.String(), project: Type.Any() }, { description: "Project created successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => projectController.createProject(request, reply, fastify)
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
          200: Type.Object({ status: Type.String(), message: Type.String(), project: Type.Any() }, { description: "Project details" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => projectController.getProjectById(request, reply, fastify)
  );
};
