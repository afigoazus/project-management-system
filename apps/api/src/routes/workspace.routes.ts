import type { FastifyPluginAsync } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const workspaceRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Ensure user is authenticated for all workspace routes
  app.addHook("onRequest", fastify.authenticate);

  // 1. Create Workspace: POST /workspaces
  app.post(
    "/workspaces",
    {
      schema: {
        body: z.object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          slug: z.string().min(2).optional(),
        }),
      },
    },
    async (request, reply) => {
      const { name, slug: customSlug } = request.body;
      const userId = request.user!.id;

      // Generate slug from name if not provided
      const slugBase = customSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      let slug = slugBase;
      let counter = 1;

      // Ensure slug uniqueness
      while (await fastify.db.workspace.findUnique({ where: { slug } })) {
        slug = `${slugBase}-${counter++}`;
      }

      const workspace = await fastify.db.workspace.create({
        data: {
          name,
          slug,
          ownerId: userId,
          members: {
            create: {
              userId,
              role: "OWNER",
            },
          },
        },
        include: {
          members: true,
        },
      });

      return reply.status(201).send({ workspace });
    }
  );

  // 2. Get User Workspaces: GET /workspaces
  app.get("/workspaces", async (request, reply) => {
    const userId = request.user!.id;

    const workspaces = await fastify.db.workspace.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reply.send({ workspaces });
  });

  // 3. Get Workspace Detail: GET /workspaces/:id
  app.get(
    "/workspaces/:id",
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

      const workspace = await fastify.db.workspace.findFirst({
        where: {
          id,
          members: {
            some: {
              userId,
            },
          },
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          projects: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

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

  // 4. Add Member: POST /workspaces/:id/members
  app.post(
    "/workspaces/:id/members",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          email: z.string().email(),
          role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
        }),
      },
    },
    async (request, reply) => {
      const { id: workspaceId } = request.params;
      const { email, role } = request.body;
      const requesterId = request.user!.id;

      // Verify requester has permissions (OWNER or ADMIN)
      const requesterMember = await fastify.db.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: requesterId,
          },
        },
      });

      if (!requesterMember || (requesterMember.role !== "OWNER" && requesterMember.role !== "ADMIN")) {
        return reply.status(403).send({
          statusCode: 403,
          error: "Forbidden",
          message: "Only workspace owners or admins can add members",
        });
      }

      // Find target user by email
      const targetUser = await fastify.db.user.findUnique({
        where: { email },
      });

      if (!targetUser) {
        return reply.status(404).send({
          statusCode: 404,
          error: "Not Found",
          message: `User with email '${email}' not found`,
        });
      }

      // Add or update workspace member
      const member = await fastify.db.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId,
            userId: targetUser.id,
          },
        },
        create: {
          workspaceId,
          userId: targetUser.id,
          role,
        },
        update: {
          role,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return reply.status(201).send({ member });
    }
  );
};

export default workspaceRoutes;
