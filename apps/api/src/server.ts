import Fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  hasZodFastifySchemaValidationErrors,
} from "fastify-type-provider-zod";
import { env } from "./config/env";
import dbPlugin from "./plugins/db";

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

// Register DB Plugin
await app.register(dbPlugin);

// Error Handler
app.setErrorHandler((error, request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      statusCode: 400,
      error: "Bad Request",
      message: "Validation failed",
      validation: error.validation,
    });
  }

  app.log.error(error);
  return reply.status(error.statusCode || 500).send({
    message: error.message || "Internal Server Error",
  });
});

// Sample Route
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
