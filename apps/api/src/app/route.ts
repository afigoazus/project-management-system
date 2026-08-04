import type { FastifyPluginAsync } from "fastify";
import { workspaceRoutes } from "./workspace/routes";
import { projectRoutes } from "./project/routes";
import { taskRoutes } from "./task/routes";

export const appRoutes: FastifyPluginAsync = async (fastify) => {
  await fastify.register(workspaceRoutes);
  await fastify.register(projectRoutes);
  await fastify.register(taskRoutes);
};

export default appRoutes;


