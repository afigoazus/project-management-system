import type { FastifyRequest, FastifyReply } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { unauthorized } from "../lib/http-response";

export async function authenticateMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return unauthorized(reply, "Authentication required");
    }

    request.user = session.user;
    request.session = session.session;
  } catch (err) {
    return unauthorized(reply, "Invalid or expired session");
  }
}
