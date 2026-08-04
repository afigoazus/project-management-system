import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import { ProjectService } from "./service";
import type { CreateProjectInput } from "./schema";

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
      return reply.status(403).send({
        statusCode: 403,
        error: "Forbidden",
        message: "You are not a member of this workspace",
      });
    }

    const project = await service.createProject(workspaceId, request.body);
    return reply.status(201).send({ project });
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
      return reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        message: "Project not found or access denied",
      });
    }

    return reply.send({ project });
  }
}

export const projectController = new ProjectController();
