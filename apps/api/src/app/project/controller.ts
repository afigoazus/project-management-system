import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { ProjectService } from "./service";
import type { CreateProjectInput } from "./schema";
import { forbidden, notFound, sendSuccess } from "../../lib/http-response";

export class ProjectController {
  private service(fastify: FastifyInstance) {
    return new ProjectService(fastify.db);
  }

  async createProject(
    request: FastifyRequest<{ Params: { workspaceId: string }; Body: CreateProjectInput }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { workspaceId } = request.params;
    const userId = request.user!.id;

    const service = this.service(fastify);
    const member = await service.checkWorkspaceMember(workspaceId, userId);
    if (!member) {
      return forbidden(reply, "You are not a member of this workspace");
    }

    const project = await service.createProject(workspaceId, request.body);
    return sendSuccess(reply, 201, "Project created successfully", "project", project);
  }

  async getProjectById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
    fastify: FastifyInstance
  ) {
    const { id } = request.params;
    const userId = request.user!.id;

    const project = await this.service(fastify).getProjectById(id, userId);
    if (!project) {
      return notFound(reply, "Project not found or access denied");
    }

    return sendSuccess(reply, 200, "Project detail retrieved successfully", "project", project);
  }
}

export const projectController = new ProjectController();
