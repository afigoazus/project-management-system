import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env dari root monorepo
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Fungsi sederhana untuk mengekspansi interpolasi variabel ${VAR} di DATABASE_URL
let dbUrl = process.env["DATABASE_URL"] || "";
dbUrl = dbUrl.replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key] || "");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: dbUrl,
  },
});
