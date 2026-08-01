import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const projectRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Ensure user is authenticated for all project routes
  app.addHook("onRequest", fastify.authenticate);

  // 1. Create Project: POST /workspaces/:workspaceId/projects
  app.post(
    "/workspaces/:workspaceId/projects",
    {
      schema: {
        params: z.object({
          workspaceId: z.string(),
        }),
        body: z.object({
          name: z.string().min(2, "Project name must be at least 2 characters"),
          description: z.string().optional(),
          githubRepoUrl: z.string().url("Invalid GitHub URL").or(z.literal("")).optional(),
        }),
      },
    },
    async (request, reply) => {
      const { workspaceId } = request.params;
      const { name, description, githubRepoUrl } = request.body;
      const userId = request.user!.id;

      // Verify user belongs to workspace
      const member = await fastify.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId,
          },
        },
      });

      if (!member) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "You are not a member of this workspace",
        });
      }

      const project = await fastify.db.project.create({
        data: {
          name,
          description: description || null,
          githubRepoUrl: githubRepoUrl || null,
          workspaceId,
        },
      });

      return reply.status(201).send({ project });
    }
  );

  // 2. Get Project Detail: GET /projects/:id
  app.get(
    "/projects/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user!.id;

      const project = await fastify.db.project.findFirst({
        where: {
          id,
          workspace: {
            members: {
              some: {
                userId,
              },
            },
          },
        },
        include: {
          workspace: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

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

export default projectRoutes;
