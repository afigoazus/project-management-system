import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});

export * from "@prisma/client";
