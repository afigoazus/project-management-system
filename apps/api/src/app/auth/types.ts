import type { PrismaClient } from "@workspace/database";
import type { auth } from "../../lib/auth";

export type UserSession = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;

export interface Context {
  db: PrismaClient;
  user?: UserSession;
  session?: Session;
}
