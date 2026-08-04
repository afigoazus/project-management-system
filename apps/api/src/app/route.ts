import type { FastifyPluginAsync } from "fastify";
import { workspaceRoutes } from "./workspace/routes";
import { projectRoutes } from "./project/routes";

export const appRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(workspaceRoutes);
  await fastify.register(projectRoutes);
};

export default appRoutes;

