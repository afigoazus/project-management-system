# Rencana Refactor Struktur Proyek Backend (`apps/api`)

Dokumen ini berisi rencana alur refactor struktur proyek backend dengan pendekatan **Feature-Based Architecture**.

---

## 1. Fitur Eksisting yang Teridentifikasi di Backend

Berdasarkan pemeriksaan rute di `apps/api/src/routes`, plugin autentikasi, serta skema Prisma (`packages/database/prisma/schema.prisma`), berikut adalah daftar fitur aktual yang ada pada proyek ini:

1. **`auth`** (Autentikasi & Manajemen Sesi - Better Auth Integration)
2. **`workspace`** (CRUD Workspace, Manajemen Member/Peran OWNER/ADMIN/MEMBER, Slug)
3. **`project`** (CRUD Project per Workspace, Github Repo URL)
4. **`user`** (Profil Pengguna & Akun)

---

## 2. Target Struktur Folder Feature-Based (`apps/api`)

```text
apps/api/
├── docs/                             # Dokumentasi & diagram database
├── src/                              # Source code utama aplikasi
│   ├── app/                          # Modul/Fitur utama aplikasi (Feature-Based)
│   │   ├── auth/                     # Fitur Autentikasi
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── routes.ts
│   │   │   ├── types.ts
│   │   │   └── schema.ts
│   │   ├── workspace/                # Fitur Workspace & Member Management
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── routes.ts
│   │   │   ├── types.ts
│   │   │   └── schema.ts
│   │   ├── project/                  # Fitur Project Management
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── routes.ts
│   │   │   ├── types.ts
│   │   │   └── schema.ts
│   │   ├── user/                     # Fitur Profil Pengguna
│   │   │   ├── controller.ts
│   │   │   ├── service.ts
│   │   │   ├── routes.ts
│   │   │   ├── types.ts
│   │   │   └── schema.ts
│   │   └── route.ts                  # Routing gabungan utama (aggregator seluruh fitur)
│   ├── config/                       # Konfigurasi environment & sistem
│   │   └── env.ts
│   ├── database/                     # Migrasi database dan seeder data
│   │   ├── migrations/
│   │   └── seeders/
│   ├── lib/                          # Helper, utility, & shared wrapper (prisma client, auth helper, logger, dsb.)
│   ├── middleware/                   # Shared Middlewares (auth guard, validate, error handler, logger)
│   └── app.ts                        # Inisialisasi Server & Setup Middleware Global
├── uploads/                          # Asset upload (avatar, dsb.)
├── package.json
├── server.ts                         # Entry point peluncuran server
└── tsconfig.json
```

*(Catatan: File konfigurasi Docker seperti `Dockerfile` dan `docker-compose.yml` diabaikan sesuai arahan).*

---

## 3. Tahapan Refactor

### Tahap 1: Pembuatan Struktur Folder & File Per Fitur
Setiap fitur (`auth`, `workspace`, `project`, `user`) didesain *self-contained* dengan struktur:
- `routes.ts`: Mendefinisikan endpoint/rute fitur.
- `controller.ts`: Menangani request/response HTTP.
- `service.ts`: Menangani logika bisnis & query Prisma.
- `types.ts`: Interface & tipe data TypeScript.
- `schema.ts`: Schema validasi.

### Tahap 2: Routing Aggregator & Setup App
- `src/app/route.ts` mendaftarkan rute dari seluruh fitur (`auth`, `workspace`, `project`, `user`).
- `src/app.ts` menyiapkan middleware global dan mendaftarkan rute dari `src/app/route.ts`.
- `src/server.ts` berfungsi murni sebagai listener server HTTP.

---

## 4. Status Saat Ini
- Branch git active: `refactor/project-structure`.
- Catatan Docker diabaikan sesuai arahan.
- Dokumen rencana refactor di [`planning/refactor_backend_structure.md`](file:///home/afigo/projects/personal/project-management/planning/refactor_backend_structure.md) telah diperbarui.
