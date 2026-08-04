import type { FastifyReply } from "fastify";

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Universal Response Helper for Fastify
 */
export function sendResponse<T = unknown>(
  reply: FastifyReply,
  status: number,
  statusText: string,
  message: string,
  fieldName?: string,
  data?: T,
  errors?: FieldError[]
) {
  return reply.status(status).send({
    status: statusText,
    message,
    ...(fieldName && data !== undefined ? { [fieldName]: data } : {}),
    ...(errors ? { errors } : {}),
  });
}

/**
 * Convenience Helper for Success Responses
 */
export function sendSuccess<T = unknown>(
  reply: FastifyReply,
  status: number,
  message: string,
  fieldName?: string,
  data?: T
) {
  return sendResponse(reply, status, "success", message, fieldName, data);
}

/**
 * Convenience Helper for Error Responses
 */
export function sendError(
  reply: FastifyReply,
  status: number,
  message: string,
  errors?: FieldError[]
) {
  const statusText =
    status === 400
      ? "Bad Request"
      : status === 401
      ? "Unauthorized"
      : status === 403
      ? "Forbidden"
      : status === 404
      ? "Not Found"
      : "Error";

  return sendResponse(reply, status, statusText, message, undefined, undefined, errors);
}

export function unauthorized(reply: FastifyReply, message = "Authentication required") {
  return sendError(reply, 401, message);
}

export function forbidden(reply: FastifyReply, message = "Access denied") {
  return sendError(reply, 403, message);
}

export function notFound(reply: FastifyReply, message = "Resource not found") {
  return sendError(reply, 404, message);
}

export function badRequest(reply: FastifyReply, message = "Invalid request parameters", errors?: FieldError[]) {
  return sendError(reply, 400, message, errors);
}
