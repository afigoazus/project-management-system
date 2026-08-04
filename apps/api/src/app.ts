import Fastify from "fastify";
import cors from "@fastify/cors";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { env } from "./config/env";
import dbPlugin from "./plugins/db";
import authPlugin from "./plugins/auth";
import docsPlugin from "./plugins/docs";
import appRoutes from "./app/route";

export function buildApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  return app;
}

export async function initializeApp() {
  const app = buildApp();

  // Register CORS
  await app.register(cors, {
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // Register DB, Auth & OpenAPI Docs Plugins
  await app.register(dbPlugin);
  await app.register(authPlugin);
  await app.register(docsPlugin);

  // Register All Feature Routes
  await app.register(appRoutes);

  // Error Handler
  app.setErrorHandler((error, _request, reply) => {
    const err = error as { statusCode?: number; message?: string; validation?: unknown };
    if (err.validation) {
      return reply.status(400).send({
        statusCode: 400,
        error: "Bad Request",
        message: "Validation failed",
        validation: err.validation,
      });
    }

    app.log.error(error);
    return reply.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error",
    });
  });


  // Health check Route
  app.get("/", async () => {
    return {
      status: "ok",
      message: "Developer Workspace API is running",
    };
  });

  return app;
}

