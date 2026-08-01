import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from "fastify-type-provider-zod";
import { env } from "./config/env";
import dbPlugin from "./plugins/db";
import authPlugin from "./plugins/auth";
import workspaceRoutes from "./routes/workspace.routes";
import projectRoutes from "./routes/project.routes";

const app = Fastify({
  logger: true,
});

// Configure validation
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Register CORS
await app.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});

// Register DB & Auth Plugins
await app.register(dbPlugin);
await app.register(authPlugin);

// Register API Routes
await app.register(workspaceRoutes);
await app.register(projectRoutes);

// Error Handler
app.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: error.validation,
    });
  }

  const err = error as { statusCode?: number; message?: string };
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

try {
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
