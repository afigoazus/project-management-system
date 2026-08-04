import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { WorkspaceService } from "./service";
import type { CreateWorkspaceInput, AddWorkspaceMemberInput } from "./schema";

export class WorkspaceController {
  private service(fastify: FastifyInstance) {
    return new WorkspaceService(fastify.db);
  }

  async createWorkspace(
    request: FastifyRequest<{ Body: CreateWorkspaceInput }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const userId = request.user!.id;
    const workspace = await this.service(fastify).createWorkspace(userId, request.body);
    return reply.status(201).send({ workspace });
  }

  async getUserWorkspaces(
    request: FastifyRequest,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const userId = request.user!.id;
    const workspaces = await this.service(fastify).getUserWorkspaces(userId);
    return reply.send({ workspaces });
  }

  async getWorkspaceById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { id } = request.params;
    const userId = request.user!.id;

    const workspace = await this.service(fastify).getWorkspaceById(userId, id);
    if (!workspace) {
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Workspace not found or access denied",
      });
    }

    return reply.send({ workspace });
  }

  async addMember(
    request: FastifyRequest<{ Params: { id: string }; Body: AddWorkspaceMemberInput }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { id: workspaceId } = request.params;
    const { email, role } = request.body;
    const requesterId = request.user!.id;

    const service = this.service(fastify);
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
}

export const workspaceController = new WorkspaceController();
