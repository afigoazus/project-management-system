import fp from "fastify-plugin";
import cors from "@fastify/cors";
import { env } from "../config/env";

export const corsMiddleware = fp(async (fastify) => {
  const allowedOrigins = Array.from(
    new Set([
      env.CORS_ORIGIN,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter(Boolean))
  );

  await fastify.register(cors, {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  });
});
