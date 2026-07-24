import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { db } from "@workspace/database";

declare module "fastify" {
  interface FastifyInstance {
    db: typeof db;
  }
}

const dbPlugin: FastifyPluginAsync = fp(async (fastify) => {
  fastify.decorate("db", db);

  fastify.addHook("onClose", async (instance) => {
    await instance.db.$disconnect();
  });
});

export default dbPlugin;
