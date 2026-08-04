# Plan: Migrasi Validasi ke TypeBox & Dokumentasi API Modern dengan Scalar

Dokumen ini berisi rencana migrasi pustaka validasi backend dari **Zod** ke **`@sinclair/typebox`** serta penyediaan dokumentasi OpenAPI modern menggunakan **Scalar** (tanpa Swagger UI).

---

## 🎯 Tujuan
1. **Validasi High-Performance & Native JSON Schema**: Mengganti Zod dengan `@sinclair/typebox` dan `@fastify/type-provider-typebox` untuk efisiensi eksekusi dan integrasi OpenAPI yang native.
2. **Dokumentasi OpenAPI Modern**: Menyediakan dokumen OpenAPI v3 yang dapat diakses melalui UI yang modern, interaktif, dan estetik menggunakan **Scalar** di endpoint `/docs`.

---

## 🛠️ Perubahan & Dependensi

### 1. Dependensi NPM (`apps/api/package.json`)
* **Remove**:
  * `zod`
  * `fastify-type-provider-zod`
* **Add**:
  * `@sinclair/typebox`
  * `@fastify/type-provider-typebox`
  * `@fastify/swagger` *(digunakan hanya untuk generate spec JSON OpenAPI)*
  * `@scalar/fastify-api-reference` *(UI dokumentasi API modern)*

---

## 📋 Langkah-Langkah Implementasi

### Langkah 1: Install & Uninstall Package
Jalankan instalasi dependensi baru dan hapus dependensi lama pada root monorepo atau workspace `apps/api`.
```bash
bun add @sinclair/typebox @fastify/type-provider-typebox @fastify/swagger @scalar/fastify-api-reference --cwd apps/api
bun remove zod fastify-type-provider-zod --cwd apps/api
```

### Langkah 2: Konfigurasi OpenAPI Spec Generator & Scalar UI (`apps/api/src/plugins/docs.ts`)
Buat plugin baru untuk mengonfigurasi OpenAPI generator (`@fastify/swagger`) dan Scalar UI (`@scalar/fastify-api-reference`).

```typescript
import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

export default fp(async (fastify) => {
  // 1. Generate OpenAPI Spec JSON dari Fastify & TypeBox routes
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Developer Workspace API",
        description: "API Documentation for Developer Workspace Project Management",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Development Server",
        },
      ],
    },
  });

  // 2. Render Scalar UI pada endpoint /docs
  await fastify.register(scalarApiReference, {
    routePrefix: "/docs",
    configuration: {
      theme: "purple",
      spec: {
        content: () => fastify.swagger(),
      },
    },
  });
});
```

### Langkah 3: Konfigurasi Re-usable Fastify & Error Handler (`apps/api/src/app.ts`)
* Ganti type provider Zod dengan `TypeBoxTypeProvider`.
* Register plugin dokumentasi OpenAPI / Scalar.
* Lakukan penyesuaian pada `setErrorHandler` untuk menangani error validasi Fastify / TypeBox standar.

```typescript
import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import docsPlugin from "./plugins/docs";
// ... imports lainnya

export function buildApp() {
  const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();
  return app;
}

export async function initializeApp() {
  const app = buildApp();
  // ... register CORS, DB, Auth
  
  // Register Documentation Plugin
  await app.register(docsPlugin);

  // Register Routes & Error Handler
  // ...
}
```

### Langkah 4: Migrasi Skema Zod ke TypeBox pada Setiap Modul

#### A. Modul Workspace (`apps/api/src/app/workspace/schema.ts`)
```typescript
import { Type, Static } from "@sinclair/typebox";

export const createWorkspaceSchema = Type.Object({
  name: Type.String({ minLength: 2, errorMessage: "Name must be at least 2 characters" }),
  slug: Type.Optional(Type.String({ minLength: 2 })),
});

export const getWorkspaceByIdSchema = Type.Object({
  id: Type.String(),
});

export const addWorkspaceMemberSchema = Type.Object({
  email: Type.String({ format: "email" }),
  role: Type.Enum({ ADMIN: "ADMIN", MEMBER: "MEMBER" }, { default: "MEMBER" }),
});

export type CreateWorkspaceInput = Static<typeof createWorkspaceSchema>;
export type AddWorkspaceMemberInput = Static<typeof addWorkspaceMemberSchema>;
```

#### B. Modul Project (`apps/api/src/app/project/schema.ts`)
```typescript
import { Type, Static } from "@sinclair/typebox";

export const createProjectSchema = Type.Object({
  name: Type.String({ minLength: 2 }),
  description: Type.Optional(Type.String()),
  githubRepoUrl: Type.Optional(
    Type.Union([Type.String({ format: "uri" }), Type.Literal("")])
  ),
});

export const getProjectParamsSchema = Type.Object({
  id: Type.String(),
});

export const createProjectParamsSchema = Type.Object({
  workspaceId: Type.String(),
});

export type CreateProjectInput = Static<typeof createProjectSchema>;
```

### Langkah 5: Refactor Route Handlers & Annotations
Tambahkan metadata OpenAPI (`tags`, `summary`, `description`, `response`) pada penulisan schema route agar tampilan dokumentasi Scalar kaya dan informatif.

Contoh pada `apps/api/src/app/workspace/routes.ts`:
```typescript
app.post(
  "/",
  {
    schema: {
      tags: ["Workspace"],
      summary: "Create a new workspace",
      body: createWorkspaceSchema,
      response: {
        201: Type.Object({
          id: Type.String(),
          name: Type.String(),
          slug: Type.String(),
        }),
      },
    },
  },
  controller.createWorkspace
);
```

---

## 🧪 Verifikasi & Pengujian
1. **Validasi Request**: Uji coba request dengan payload yang invalid untuk memastikan error response format tetap berjalan sebagaimana mestinya (`400 Bad Request`).
2. **Dokumentasi UI**: Akses `http://localhost:4000/docs` di browser untuk memastikan interface Scalar memuat OpenAPI spec dengan benar dan fitur *try-it-out* berfungsi.
3. **Type-Checking**: Jalankan `bun run typecheck` atau build backend untuk mengonfirmasi tidak ada ketidakcocokan tipe TypeScript.
