import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { createWorkspaceSchema, getWorkspaceByIdSchema, addWorkspaceMemberSchema } from "./schema";
import { workspaceController } from "./controller";
import { commonErrorResponses } from "../../lib/error-schemas";

export const workspaceRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<TypeBoxTypeProvider>();

  app.addHook("onRequest", fastify.authenticate);

  // 1. Create Workspace
  app.post(
    "/workspaces",
    {
      schema: {
        tags: ["Workspace"],
        summary: "Create a new workspace",
        description: "Creates a new workspace for the authenticated user and sets the user as OWNER.",
        body: createWorkspaceSchema,
        response: {
          201: Type.Object({ status: Type.String(), message: Type.String(), workspace: Type.Any() }, { description: "Workspace created successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => workspaceController.createWorkspace(request, reply, fastify)
  );

  // 2. Get User Workspaces
  app.get(
    "/workspaces",
    {
      schema: {
        tags: ["Workspace"],
        summary: "Get workspaces of authenticated user",
        description: "Retrieves all workspaces accessible by the currently authenticated user.",
        response: {
          200: Type.Object({ status: Type.String(), message: Type.String(), workspaces: Type.Array(Type.Any()) }, { description: "List of user workspaces" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => workspaceController.getUserWorkspaces(request, reply, fastify)
  );

  // 3. Get Workspace Detail
  app.get(
    "/workspaces/:id",
    {
      schema: {
        tags: ["Workspace"],
        summary: "Get workspace by ID",
        description: "Retrieves detailed information of a specific workspace if the user is a member.",
        params: getWorkspaceByIdSchema,
        response: {
          200: Type.Object({ status: Type.String(), message: Type.String(), workspace: Type.Any() }, { description: "Workspace details" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => workspaceController.getWorkspaceById(request, reply, fastify)
  );

  // 4. Add Member
  app.post(
    "/workspaces/:id/members",
    {
      schema: {
        tags: ["Workspace"],
        summary: "Add a member to workspace",
        description: "Adds a new member to the specified workspace. Requires OWNER or ADMIN role.",
        params: getWorkspaceByIdSchema,
        body: addWorkspaceMemberSchema,
        response: {
          201: Type.Object({ status: Type.String(), message: Type.String(), member: Type.Any() }, { description: "Member added successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => workspaceController.addMember(request, reply, fastify)
  );
};
