import type { FastifyPluginAsync } from "fastify";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../../lib/auth";

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.all("/api/auth/*", async (request, reply) => {
    return toNodeHandler(auth)(request.raw, reply.raw);
  });
};
