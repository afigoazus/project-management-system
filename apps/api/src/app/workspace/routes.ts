import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";
import { createWorkspaceSchema, getWorkspaceByIdSchema, addWorkspaceMemberSchema } from "./schema";
import { WorkspaceService } from "./service";
import { commonErrorResponses } from "../../lib/error-schemas";
import { forbidden, notFound } from "../../lib/http-response";

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
          201: Type.Object({ workspace: Type.Any() }, { description: "Workspace created successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.id;
      const service = new WorkspaceService(fastify.db);
      const workspace = await service.createWorkspace(userId, request.body);
      return reply.status(201).send({ workspace });
    }
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
          200: Type.Object({ workspaces: Type.Array(Type.Any()) }, { description: "List of user workspaces" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user!.id;
      const service = new WorkspaceService(fastify.db);
      const workspaces = await service.getUserWorkspaces(userId);
      return reply.send({ workspaces });
    }
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
          200: Type.Object({ workspace: Type.Any() }, { description: "Workspace details" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new WorkspaceService(fastify.db);

      const workspace = await service.getWorkspaceById(userId, id);
      if (!workspace) {
        return notFound(reply, "Workspace not found or access denied");
      }

      return reply.send({ workspace });
    }
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
          201: Type.Object({ member: Type.Any() }, { description: "Member added successfully" }),
          ...commonErrorResponses,
        },
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.params;
      const { email, role } = request.body;
      const requesterId = request.user!.id;
      const service = new WorkspaceService(fastify.db);

      const requesterMember = await service.getMemberRole(workspaceId, requesterId);
      if (!requesterMember || (requesterMember.role !== "OWNER" && requesterMember.role !== "ADMIN")) {
        return forbidden(reply, "Only workspace owners or admins can add members");
      }

      const targetUser = await service.findUserByEmail(email);
      if (!targetUser) {
        return notFound(reply, `User with email '${email}' not found`);
      }

      const member = await service.addMember(workspaceId, targetUser.id, role);
      return reply.status(201).send({ member });
    }
  );
};

