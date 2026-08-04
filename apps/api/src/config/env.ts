import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

// Load .env dari root monorepo jika belum terdefinisi
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  CORS_ORIGIN: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().default("development_secret_key_123456789_min_32_chars"),
  BETTER_AUTH_URL: z.string().default("http://localhost:4000"),
  GITHUB_CLIENT_ID: z.string().optional().default(""),
  GITHUB_CLIENT_SECRET: z.string().optional().default(""),
});

const parsed = envSchema.parse(process.env);

export const env = {
  ...parsed,
  CORS_ORIGIN: parsed.FRONTEND_URL || parsed.CORS_ORIGIN || "http://localhost:3000",
};
