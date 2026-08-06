"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Navbar } from "@/features/home/components/Navbar";
import Link from "next/link";
import {
  FolderKanban,
  Building2,
  Github,
  Calendar,
  ExternalLink,
  Loader2,
  ArrowLeft,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { KanbanBoard } from "@/features/task/components/KanbanBoard";
import { useProjectDetail, useProjectTasks } from "../hooks/project.hook";

interface ProjectDetailContentProps {
  projectId: string;
}

export function ProjectDetailContent({ projectId }: ProjectDetailContentProps) {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  const { data: project, isLoading: projectLoading, error: projectError } = useProjectDetail(projectId);
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/login");
    }
  }, [session, sessionPending, router]);

  const isLoading = sessionPending || projectLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="text-xs font-medium">Loading project dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center border border-rose-500/30 space-y-4">
            <h3 className="text-lg font-bold text-rose-400">Error Loading Project</h3>
            <p className="text-xs text-slate-400">
              {projectError instanceof Error ? projectError.message : "Project not found"}
            </p>
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
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/workspaces" className="hover:text-white transition-colors">
            Workspaces
          </Link>
          <span>/</span>
          <Link
            href={`/workspaces/${project.workspace.id}`}
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <Building2 className="h-3.5 w-3.5 text-indigo-400" />
            {project.workspace.name}
          </Link>
          <span>/</span>
          <span className="text-slate-200 font-semibold">{project.name}</span>
        </div>

        {/* Project Header Banner */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl gradient-bg text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <FolderKanban className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">{project.name}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Workspace: <span className="text-indigo-300 font-semibold">{project.workspace.name}</span>
                </p>
              </div>
            </div>

            {project.description && (
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {project.githubRepoUrl ? (
              <a
                href={project.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 font-semibold text-xs transition-all"
              >
                <Github className="h-4 w-4" />
                View Repository
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                No GitHub Repo Linked
              </span>
            )}
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</span>
              <p className="text-sm font-bold text-emerald-400">Active (v0.1)</p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Created</span>
              <p className="text-xs font-semibold text-white">
                {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Integration</span>
              <p className="text-xs font-semibold text-white">
                {project.githubRepoUrl ? "GitHub Connected" : "Local Workspace"}
              </p>
            </div>
          </div>
        </div>

        {/* Kanban Board Section */}
        <div className="pt-4">
          <KanbanBoard projectId={project.id} initialTasks={tasks} />
        </div>

        {/* Back Link */}
        <div>
          <Link
            href={`/workspaces/${project.workspace.id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {project.workspace.name} Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
