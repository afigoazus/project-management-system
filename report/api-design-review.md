# 📊 Laporan Review Desain REST API

**Proyek:** Developer Workspace API  
**Versi API:** 1.0.0  
**Spesifikasi OpenAPI:** 3.0.3  
**Tanggal Review:** 4 Agustus 2026  
**Peranti Analisis:** `api-design-reviewer` (Linter & Scorecard)

---

## 🏆 Ringkasan Hasil Penilaian

| Metrik Penilaian | Skor | Predikat (Grade) | Status |
| :--- | :---: | :---: | :--- |
| **API Scorecard (Keseluruhan)** | **46.03 / 100** | **F** | ⚠️ Memerlukan Perbaikan Dokumen & Skema |
| **API Linter (Konvensi REST)** | **95.73 / 100** | **A** | ✅ Penamaan & Struktur URL Sangat Baik |

---

## 📈 Rincian Kategori Scorecard

| Kategori | Bobot | Skor | Grade | Catatan & Analisis |
| :--- | :---: | :---: | :---: | :--- |
| **Consistency (Konsistensi)** | 30% | 83.28% | **B** | Struktur penamaan URL (`/workspaces`, `/projects`, `/tasks`) dan penggunaan HTTP Method (GET, POST, PATCH, DELETE) sudah konsisten dan sesuai standar REST. |
| **Documentation (Dokumentasi)** | 20% | 50.00% | **F** | Rute API belum dilengkapi dengan atribut `summary`, `description`, dan contoh payload pada schema Fastify. |
| **Security (Keamanan)** | 20% | 20.00% | **F** | Skema autentikasi (`securitySchemes` & `security`) belum terdaftar secara eksplisit di spesifikasi OpenAPI Swagger. |
| **Usability (Kemudahan Penggunaan)** | 15% | 33.00% | **F** | Skema respon untuk error umum (400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error) belum terdefinisi di skema rute. |
| **Performance (Kinerja)** | 15% | 14.00% | **F** | Endpoint pengambil daftar/koleksi data (`GET /workspaces`, `GET /projects/{projectId}/tasks`) belum mendukung parameter paginasi (`page`, `limit`, atau `cursor`). |

---

## 🔍 Temuan Utama & Rekomendasi

### 1. Deklarasi Skema Keamanan (`securitySchemes`)
* **Masalah:** Meskipun middleware autentikasi `fastify.authenticate` telah diterapkan pada rute backend, spesifikasi OpenAPI tidak mendeklarasikan skema autentikasi (seperti Bearer Token / Cookie). Hal ini menyebabkan API docs (Scalar/Swagger UI) tidak menyediakan tombol input token / otorisasi.
* **Solusi:** Daftarkan `securitySchemes` pada plugin Swagger di [`apps/api/src/plugins/docs.ts`](file:///home/afigo/projects/personal/project-management/apps/api/src/plugins/docs.ts).

### 2. Penambahan Deskripsi & Dokumentasi Rute
* **Masalah:** OpenAPI Linter mendeteksi 11 endpoint yang belum memiliki deskripsi (`description`) dan ringkasan fungsi (`summary`).
* **Solusi:** Lengkapi properti `schema` pada setiap rute Fastify di folder `apps/api/src/app/*/routes.ts`.

### 3. Definisi Respon Error Standar (400, 401, 404, 500)
* **Masalah:** OpenAPI Linter menemukan 12 peringatan (warnings) akibat tidak tersedianya skema respon error pada definisi rute.
* **Solusi:** Buat reusable TypeBox schema untuk respon error dan daftarkan di properti `response` skema rute.

### 4. Implementasi Paginasi pada Endpoint List
* **Masalah:** Endpoint koleksi seperti `GET /workspaces` dan `GET /projects/{projectId}/tasks` mengembalikan seluruh item tanpa opsi batasan (*limit*) atau halaman (*page*).
* **Solusi:** Tambahkan parameter query `page` & `limit` (offset-based) atau `cursor` (cursor-based) untuk mencegah masalah kinerja saat data membesar.

---

## 🛠️ Panduan Perbaikan Kode

### 1. Memperbarui Plugin Docs ([`apps/api/src/plugins/docs.ts`](file:///home/afigo/projects/personal/project-management/apps/api/src/plugins/docs.ts))

```typescript
import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import scalarApiReference from "@scalar/fastify-api-reference";

export default fp(async (fastify) => {
  await fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Developer Workspace API",
        description: "API Documentation for Developer Workspace Project Management",
        version: "1.0.0",
        contact: {
          name: "Developer Team",
        },
      },
      servers: [
        {
          url: "http://localhost:4000",
          description: "Development Server",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

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

### 2. Contoh Pengayaan Skema Rute ([`apps/api/src/app/workspace/routes.ts`](file:///home/afigo/projects/personal/project-management/apps/api/src/app/workspace/routes.ts))

```typescript
import { Type } from "@sinclair/typebox";

export const ErrorResponseSchema = Type.Object({
  statusCode: Type.Number({ example: 400 }),
  error: Type.String({ example: "Bad Request" }),
  message: Type.String({ example: "Validation failed" }),
});

app.get(
  "/workspaces",
  {
    schema: {
      summary: "Mengambil daftar workspace user",
      description: "Mengembalikan semua workspace yang dimiliki atau diakses oleh pengguna yang terautentikasi.",
      tags: ["Workspace"],
      response: {
        200: Type.Array(WorkspaceSchema),
        401: ErrorResponseSchema,
        500: ErrorResponseSchema,
      },
    },
  },
  async (request, reply) => {
    // Controller logic
  }
);
```

---

## 📌 Rencana Aksi (Checklist Perbaikan)

- [ ] Memperbarui [`apps/api/src/plugins/docs.ts`](file:///home/afigo/projects/personal/project-management/apps/api/src/plugins/docs.ts) dengan `securitySchemes`.
- [ ] Menambahkan `summary`, `description`, dan `tags` pada semua rute (`workspace`, `project`, `task`).
- [ ] Mendefinisikan `ErrorResponseSchema` pada skema respon rute.
- [ ] Menambahkan parameter query paginasi pada rute list data.
