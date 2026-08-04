import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import { sendError } from "../lib/http-response";

export function errorMiddleware(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const err = error as { statusCode?: number; message?: string; validation?: Array<{ instancePath?: string; message?: string }> };
  
  if (err.validation && Array.isArray(err.validation)) {
    const formattedErrors = err.validation.map((v) => ({
      field: v.instancePath?.replace(/^\//, "") || "body",
      message: v.message || "Invalid value",
    }));

    return sendError(reply, 400, "Validation failed", formattedErrors);
  }

  const statusCode = err.statusCode || 500;
  request.log.error(error);
  return sendError(reply, statusCode, err.message || "Internal Server Error");
}
