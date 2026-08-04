"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { Navbar } from "@/features/home/components/Navbar";
import { CreateProjectModal } from "@/features/project/components/CreateProjectModal";
import { AddMemberModal } from "@/features/workspace/components/AddMemberModal";
import Link from "next/link";
import Image from "next/image";
import {
  FolderKanban,
  Users,
  Plus,
  UserPlus,
  Github,
  ArrowRight,
  Loader2,
  Calendar,
} from "lucide-react";

interface Member {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface Project {
  id: string;
  name: string;
  description?: string;
  githubRepoUrl?: string;
  createdAt: string;
}

interface WorkspaceDetail {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  members: Member[];
  projects: Project[];
}

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  const [workspace, setWorkspace] = useState<WorkspaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const fetchWorkspaceDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch<{ workspace: WorkspaceDetail }>(`/workspaces/${workspaceId}`);
      setWorkspace(res.workspace);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load workspace details");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/login");
    } else if (session && workspaceId) {
      fetchWorkspaceDetail();
    }
  }, [session, sessionPending, workspaceId, router, fetchWorkspaceDetail]);

  if (sessionPending || loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="text-xs font-medium">Loading workspace dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center border border-rose-500/30 space-y-4">
            <h3 className="text-lg font-bold text-rose-400">Error Loading Workspace</h3>
            <p className="text-xs text-slate-400">{error || "Workspace not found"}</p>
            <Link
              href="/workspaces"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-semibold text-xs"
            >
              Back to Workspaces
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Workspace Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl gradient-bg text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-500/20">
                {workspace.name[0]?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">{workspace.name}</h1>
                <span className="text-xs font-mono text-indigo-300">/{workspace.slug}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => setIsMemberModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-semibold text-xs transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4 text-purple-400" />
              Add Member
            </button>

            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white font-semibold text-xs hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content: Projects (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-indigo-400" />
                Projects ({workspace.projects.length})
              </h2>

              <button
                onClick={() => setIsProjectModalOpen(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Project
              </button>
            </div>

            {workspace.projects.length === 0 ? (
              <div className="glass-card rounded-2xl p-10 text-center border border-slate-800 space-y-3">
                <FolderKanban className="h-10 w-10 text-slate-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-300">No Projects Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create your first project inside this workspace to start building.
                </p>
                <button
                  onClick={() => setIsProjectModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-semibold text-xs shadow-md shadow-indigo-500/20 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workspace.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="glass-card rounded-xl p-5 border border-slate-800 glass-card-hover group flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </h3>
                        {project.githubRepoUrl && (
                          <span
                            title="GitHub Repository Connected"
                            className="p-1 rounded-md bg-slate-900 border border-slate-700/60 text-slate-400"
                          >
                            <Github className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2">
                        {project.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1 text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                        Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Members (1 Col) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Members ({workspace.members.length})
              </h2>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="space-y-3 divide-y divide-slate-800/80">
                {workspace.members.map((m) => (
                  <div key={m.id} className="pt-3 first:pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {m.user.image ? (
                        <Image
                          src={m.user.image}
                          alt={m.user.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {m.user.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{m.user.name}</span>
                        <span className="text-[11px] text-slate-500">{m.user.email}</span>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        m.role === "OWNER"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                          : m.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-slate-800 text-slate-400 border-slate-700"
                      }`}
                    >
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsMemberModalOpen(true)}
                className="w-full mt-2 py-2 rounded-xl glass border border-slate-700 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5 text-purple-400" />
                Invite New Member
              </button>
            </div>
          </div>
        </div>
      </main>

      <CreateProjectModal
        workspaceId={workspace.id}
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSuccess={fetchWorkspaceDetail}
      />

      <AddMemberModal
        workspaceId={workspace.id}
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onSuccess={fetchWorkspaceDetail}
      />
    </div>
  );
}
