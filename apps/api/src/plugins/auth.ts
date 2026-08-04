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
    const origin = request.headers.origin;
    if (origin) {
      reply.raw.setHeader("Access-Control-Allow-Origin", origin);
      reply.raw.setHeader("Access-Control-Allow-Credentials", "true");
      reply.raw.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      reply.raw.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    }

    if (request.method === "OPTIONS") {
      reply.raw.statusCode = 200;
      reply.raw.end();
      return reply;
    }

    // Jika Fastify sudah memasukkan payload ke request.body,
    // lampirkan kembali ke request.raw untuk Better Auth node handler
    if (request.body && typeof request.body === "object") {
      (request.raw as { body?: unknown }).body = request.body;
    }

    return toNodeHandler(auth)(request.raw, reply.raw);
  });

  // Decorator to protect routes requiring authentication
  fastify.decorate("authenticate", authenticateMiddleware);
});

export default authPlugin;
