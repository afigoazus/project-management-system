import type { FastifyPluginAsync } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { createWorkspaceSchema, getWorkspaceByIdSchema, addWorkspaceMemberSchema } from "./schema";
import { WorkspaceService } from "./service";

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
        body: createWorkspaceSchema,
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
        params: getWorkspaceByIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;
      const service = new WorkspaceService(fastify.db);

      const workspace = await service.getWorkspaceById(userId, id);
      if (!workspace) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: "Workspace not found or access denied",
        });
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
        params: getWorkspaceByIdSchema,
        body: addWorkspaceMemberSchema,
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.params;
      const { email, role } = request.body;
      const requesterId = request.user!.id;
      const service = new WorkspaceService(fastify.db);

      const requesterMember = await service.getMemberRole(workspaceId, requesterId);
      if (!requesterMember || (requesterMember.role !== "OWNER" && requesterMember.role !== "ADMIN")) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only workspace owners or admins can add members",
        });
      }

      const targetUser = await service.findUserByEmail(email);
      if (!targetUser) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `User with email '${email}' not found`,
        });
      }

      const member = await service.addMember(workspaceId, targetUser.id, role);
      return reply.status(201).send({ member });
    }
  );
};

