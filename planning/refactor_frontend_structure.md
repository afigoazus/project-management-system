# Rencana Refactor Struktur Frontend (`apps/web`)

Dokumen ini berisi analisis fitur eksisting serta rencana refactor struktur aplikasi Next.js frontend (`apps/web`) berdasarkan acuan `PROJECT_INFO.md`.

---

## 1. Fitur Eksisting yang Teridentifikasi di Frontend (`apps/web`)

Berdasarkan pemeriksaan rute `apps/web/src/app` dan komponen UI di `apps/web/src/components`:

1. **`auth`**: Halaman Login (`/login`) & Register (`/register`), serta komponen autentikasi.
2. **`workspace`**: Halaman daftar workspace & detail workspace (`/workspaces`, `/workspaces/[id]`), modal buat workspace (`CreateWorkspaceModal.tsx`), serta modal tambah anggota (`AddMemberModal.tsx`).
3. **`project`**: Halaman detail proyek (`/projects/[id]`) dan modal buat proyek (`CreateProjectModal.tsx`).
4. **`home` / `dashboard`**: Halaman landing page & navigasi utama (`page.tsx`, `Navbar.tsx`).

---

## 2. Target Struktur Folder (`apps/web/src`)

Sesuai acuan `PROJECT_INFO.md`, struktur frontend akan disesuaikan menggunakan **Route Groups** pada Next.js App Router dan modularisasi **Feature-Based Architecture** di bawah `src/features/`:

```text
apps/web/src/
├── app/                              # Next.js App Router & Layouts
│   ├── (auth)/                       # Route Group khusus Autentikasi
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                       # Route Group utama aplikasi
│   │   ├── workspaces/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── projects/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── globals.css                   # Styling global
│   ├── layout.tsx                    # Root Layout
│   └── page.tsx                      # Landing Page
├── components/                       # Shared Reusable UI Components
│   └── ui/                           # Primitive UI components (shadcn/ui / shared modals jika umum)
├── features/                         # Feature-Based Modules (Setiap fitur berisi komponen, hooks, types, api)
│   ├── auth/                         # Modul Fitur Autentikasi
│   │   ├── components/               # LoginForm, RegisterForm, dll.
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   ├── workspace/                    # Modul Fitur Workspace
│   │   ├── components/               # CreateWorkspaceModal, AddMemberModal, WorkspaceCard, dll.
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   ├── project/                      # Modul Fitur Project
│   │   ├── components/               # CreateProjectModal, ProjectDetailView, dll.
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types/
│   └── home/                         # Modul Fitur Landing / Home
│       └── components/               # Navbar, HeroSection, dll.
├── hooks/                            # Global Custom React Hooks
├── lib/                              # Helper & Utilities (auth client, fetcher/axios instance, utils)
└── providers/                        # Global React Context Providers
```

---

## 3. Langkah Refactor Frontend

1. **Restrukturisasi App Router (`src/app/`)**:
   - Memindahkan `/login` dan `/register` ke Route Group `(auth)/`.
   - Memindahkan `/workspaces` dan `/projects` ke Route Group `(main)/`.
2. **Pemindahan Komponen ke `src/features/`**:
   - Memindahkan `CreateWorkspaceModal.tsx` & `AddMemberModal.tsx` ke `src/features/workspace/components/`.
   - Memindahkan `CreateProjectModal.tsx` ke `src/features/project/components/`.
   - Memindahkan `Navbar.tsx` ke `src/features/home/components/` atau `src/components/`.
3. **Penyelarasan Import**:
   - Memperbarui path import pada seluruh halaman dan komponen agar mengarah ke folder fitur baru.
4. **Pengujian Build & Type-Checking**:
   - Menjalankan `bun run lint` atau `bun dev:web` untuk memastikan tidak ada kesalahan import/tipe.

---

## 4. Status
- Rencana disimpan di [`planning/refactor_frontend_structure.md`](file:///home/afigo/projects/personal/project-management/planning/refactor_frontend_structure.md).
- Status: *Menunggu persetujuan sebelum eksekusi*.
