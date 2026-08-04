import Fastify from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import dbPlugin from "./plugins/db";
import authPlugin from "./plugins/auth";
import docsPlugin from "./plugins/docs";
import appRoutes from "./app/route";
import { corsMiddleware } from "./middleware/cors.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

export function buildApp() {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  return app;
}

export async function initializeApp() {
  const app = buildApp();

  // Register CORS Middleware
  await app.register(corsMiddleware);

  // Register DB, Auth & OpenAPI Docs Plugins
  await app.register(dbPlugin);
  await app.register(authPlugin);
  await app.register(docsPlugin);

  // Register All Feature Routes
  await app.register(appRoutes);

  // Error Handler Middleware
  app.setErrorHandler(errorMiddleware);


  // Health check Route
  app.get("/", async () => {
    return {
      status: "ok",
      message: "Developer Workspace API is running",
    };
  });

  return app;
}

