import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    user?: typeof auth.$Infer.Session.user;
    session?: typeof auth.$Infer.Session.session;
  }
}

const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Handle all auth requests under /api/auth/*
  fastify.all("/api/auth/*", async (request, reply) => {
    return toNodeHandler(auth)(request.raw, reply.raw);
  });

  // Decorator to protect routes requiring authentication
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const session = await auth.api.getSession({
          headers: fromNodeHeaders(request.headers),
        });

        if (!session) {
          return reply.status(401).send({
            statusCode: 401,
            error: "Unauthorized",
            message: "Authentication required",
          });
        }

        request.user = session.user;
        request.session = session.session;
      } catch (err) {
        return reply.status(401).send({
          statusCode: 401,
          error: "Unauthorized",
          message: "Invalid or expired session",
        });
      }
    }
  );
});

export default authPlugin;
