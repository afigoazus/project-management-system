# Project Management System

A modern, full-stack monorepo application for managing workspaces, projects, tasks, and teams. Built with performance, scalability, and type safety in mind.

> [!NOTE]
> This project uses **Turborepo** with **Bun** for fast package management and build pipelines.

---

## Features

- **Workspace & Team Management**: Organize teams, roles, and member permissions within isolated workspaces.
- **Project Tracking**: Multi-project tracking with task assignments, statuses, and deadlines.
- **Modern Authentication**: Secure authentication flow supporting JWT and OAuth (Google integration).
- **Type-Safe Architecture**: End-to-end TypeScript support across frontend, backend, and database schema.

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Monorepo Tooling** | [Turborepo](https://turbo.build/) & [Bun](https://bun.sh/) |
| **Frontend** | [Next.js](https://nextjs.org/) (App Router), TypeScript, [Tailwind CSS](https://tailwindcss.com/), shadcn/ui |
| **Backend** | [Fastify](https://fastify.dev/), TypeScript, [Zod](https://zod.dev/) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/) |

---

## Repository Structure

```text
.
├── apps/
│   ├── api/          # Backend Application (Fastify + TypeScript)
│   └── web/          # Frontend Application (Next.js App Router)
├── packages/
│   └── database/     # Shared Prisma ORM schema & client (@workspace/database)
├── planning/         # Architectural docs & design blueprints
└── turbo.json        # Turborepo task pipeline configuration
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your environment:

- [Bun](https://bun.sh/) (v1.3.14 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) database instance

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/afigoazus/project-management-system.git
   cd project-management-system
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Environment Setup:**
   Copy the example environment file and adjust your database and API credentials:
   ```bash
   cp .env.example .env
   ```

4. **Setup Database:**
   Generate the Prisma client and apply migrations:
   ```bash
   bun db:generate
   bun db:migrate
   ```
   *(Optional)* Seed initial data:
   ```bash
   bun db:seed
   ```

---

## Development

Run the development servers using Turborepo or target individual applications:

> [!TIP]
> Use `bun dev` to run both the API and Web applications concurrently.

- **Run all applications:**
  ```bash
  bun dev
  ```
- **Run Frontend (`apps/web`) only:**
  ```bash
  bun dev:web
  ```
- **Run Backend (`apps/api`) only:**
  ```bash
  bun dev:api
  ```

### Database Management Commands

| Command | Description |
| :--- | :--- |
| `bun db:generate` | Generate Prisma Client code |
| `bun db:migrate` | Apply Prisma schema migrations |
| `bun db:push` | Push schema changes directly to DB (dev/testing) |
| `bun db:seed` | Seed database with sample data |
| `bun db:studio` | Open Prisma Studio GUI |

---

## Build & Quality Checks

Validate linting and production builds across the monorepo:

```bash
# Run linter across all packages
bun lint

# Build all applications for production
bun build
```
