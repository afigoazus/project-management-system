import path from "node:path";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

let dbUrl = process.env.DATABASE_URL || "";

if (dbUrl.includes("${")) {
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD || "admin123";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "5432";
  const name = process.env.DB_NAME || "project-management";
  dbUrl = `postgresql://${user}:${password}@${host}:${port}/${name}`;
}

const pool = new pg.Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);

export const db = new PrismaClient(
  dbUrl.startsWith("prisma://") || dbUrl.startsWith("prisma+postgres://")
    ? { accelerateUrl: dbUrl }
    : { adapter }
);

export * from "@prisma/client";
