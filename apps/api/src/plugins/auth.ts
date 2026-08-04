import fp from "fastify-plugin";
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../lib/auth";
import { authenticateMiddleware } from "../middleware/auth.middleware";

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
  fastify.decorate("authenticate", authenticateMiddleware);
});

export default authPlugin;
