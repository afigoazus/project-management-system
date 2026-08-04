import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { WorkspaceService } from "./service";
import type { CreateWorkspaceInput, AddWorkspaceMemberInput } from "./schema";
import { forbidden, notFound, sendSuccess } from "../../lib/http-response";

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
    return sendSuccess(reply, 201, "Workspace created successfully", "workspace", workspace);
  }

  async getUserWorkspaces(
    request: FastifyRequest,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const userId = request.user!.id;
    const workspaces = await this.service(fastify).getUserWorkspaces(userId);
    return sendSuccess(reply, 200, "Workspaces retrieved successfully", "workspaces", workspaces);
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
      return notFound(reply, "Workspace not found or access denied");
    }

    return sendSuccess(reply, 200, "Workspace detail retrieved successfully", "workspace", workspace);
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
      return forbidden(reply, "Only workspace owners or admins can add members");
    }

    const targetUser = await service.findUserByEmail(email);
    if (!targetUser) {
      return notFound(reply, `User with email '${email}' not found`);
    }

    const member = await service.addMember(workspaceId, targetUser.id, role);
    return sendSuccess(reply, 201, "Member added successfully", "member", member);
  }
}

export const workspaceController = new WorkspaceController();
