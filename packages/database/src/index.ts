import { PrismaClient } from "@prisma/client";

const dbUrl = process.env.DATABASE_URL || "";

export const db = new PrismaClient(
  dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+postgres://")
    ? { accelerateUrl: dbUrl }
    : {}
);

export * from "@prisma/client";
