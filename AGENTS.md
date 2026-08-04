# Developer Workspace - Agent Guidelines

Welcome to the Developer Workspace project. This document serves as a guide for AI agents working on this codebase.

## Tech Stack & Architecture
This is a monorepo managed with **Turborepo** and **Bun**.

- **Frontend (`apps/web`)**: Next.js (TypeScript, Tailwind CSS, shadcn/ui) - *Feature-Based & Route Groups Architecture*
- **Backend (`apps/api`)**: Fastify (TypeScript, Zod for validation, Fastify Type Provider Zod) - *Feature-Based Architecture*
- **Database (`packages/database`)**: PostgreSQL with Prisma ORM
- **Shared packages (`packages/*`)**:
  - `@workspace/database`: Exposes Prisma Client

---

## Project Directory Structure

```text
.
├── apps/
│   ├── api/                          # Backend Application (Fastify + TypeScript)
│   │   ├── docs/                     # Database documentation & diagrams
│   │   ├── src/
│   │   │   ├── app/                  # Feature-Based Modules (self-contained features)
│   │   │   │   ├── auth/             # (routes.ts, types.ts)
│   │   │   │   ├── workspace/        # (controller.ts, service.ts, routes.ts, schema.ts)
│   │   │   │   ├── project/          # (controller.ts, service.ts, routes.ts, schema.ts)
│   │   │   │   ├── user/             # User profile module
│   │   │   │   └── route.ts          # Main route aggregator
│   │   │   ├── config/               # Environment & system configurations
│   │   │   ├── database/             # Migrations & seeders
│   │   │   ├── lib/                  # Shared utilities & database clients
│   │   │   ├── middleware/           # Shared middlewares
│   │   │   └── app.ts                # Application initialization & middleware setup
│   │   ├── package.json
│   │   └── server.ts                 # HTTP Server entry point
│   │
│   └── web/                          # Frontend Application (Next.js App Router)
│       └── src/
│           ├── app/                  # Route Groups & Next.js Pages
│           │   ├── (auth)/           # Authentication routes (/login, /register)
│           │   ├── (main)/           # Application main routes (/workspaces, /projects)
│           │   ├── globals.css
│           │   ├── layout.tsx
│           │   └── page.tsx          # Landing page
│           ├── components/           # Reusable shared UI components
│           ├── features/             # Feature-Based Modules (components, hooks, api, types)
│           │   ├── auth/
│           │   ├── workspace/
│           │   ├── project/
│           │   └── home/
│           ├── hooks/                # Global React hooks
│           ├── lib/                  # Utilities & API fetchers
│           └── providers/            # React Context providers
│
├── packages/
│   └── database/                     # Shared Prisma ORM package
│       └── prisma/
│           └── schema.prisma
│
├── planning/                         # Architecture & refactoring plans
└── turbo.json
```

---

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
2. In the backend, use the **Feature-Based Architecture** in `apps/api/src/app/<feature>/` containing `controller.ts`, `service.ts`, `routes.ts`, and `schema.ts`.
3. In the frontend, place feature-specific UI components in `apps/web/src/features/<feature>/components/` and use Next.js Route Groups (`(auth)`, `(main)`) for page routes.
4. Validate all backend requests/responses using Zod and configure Fastify schemas.
5. Keep `.env` variables safe. Never commit `.env` files. Document new variables in `.env.example` files.
6. When editing Prisma schemas, make sure to run the generator afterward.
