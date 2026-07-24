# Developer Workspace - Agent Guidelines

Welcome to the Developer Workspace project. This document serves as a guide for AI agents working on this codebase.

## Tech Stack & Architecture
This is a monorepo managed with **Turborepo** and **Bun**.

- **Frontend (`apps/web`)**: Next.js (TypeScript, Tailwind CSS, shadcn/ui)
- **Backend (`apps/api`)**: Fastify (TypeScript, Zod for validation, Fastify Type Provider Zod)
- **Database (`packages/database`)**: PostgreSQL with Prisma ORM
- **Shared packages (`packages/*`)**:
  - `@workspace/database`: Exposes Prisma Client

## Development Commands
Always run these commands from the root directory:

- **Install dependencies**: `bun install`
- **Run all apps in dev mode**: `bun dev`
- **Run API (backend) only**: `bun dev:api`
- **Run Web (frontend) only**: `bun dev:web`
- **Generate Prisma Client**: `bun x prisma generate --schema=packages/database/prisma/schema.prisma`
- **Run migrations**: `bun x prisma migrate dev --schema=packages/database/prisma/schema.prisma`

## Guidelines for Code Changes
1. Keep the code type-safe using TypeScript.
2. In the backend, validate all requests/responses using Zod and configure Fastify schemas.
3. Keep the `.env` variables safe. Never commit `.env` files. Document new variables in `.env.example` files.
4. When editing Prisma schemas, make sure to run the generator afterward.
