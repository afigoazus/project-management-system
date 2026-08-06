"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "../hooks/workspace.hook";
import { useWorkspaceStore } from "../stores/workspace.store";
import { Navbar } from "@/features/home/components/Navbar";
import { CreateWorkspaceModal } from "./CreateWorkspaceModal";
import Link from "next/link";
import { Building2, FolderKanban, Users, Plus, ArrowRight, Loader2, Sparkles } from "lucide-react";

export function WorkspacesListContent() {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();

  const { data: workspaces = [], isLoading: workspacesLoading } = useWorkspaces();
  const { isCreateModalOpen, openCreateModal, closeCreateModal } = useWorkspaceStore();

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/login");
    }
  }, [session, sessionPending, router]);

  if (sessionPending || (workspacesLoading && workspaces.length === 0)) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
            <p className="text-xs font-medium">Loading your workspaces...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar onOpenCreateWorkspace={openCreateModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Building2 className="h-6 w-6 text-indigo-400" />
              Workspaces
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select an existing workspace or create a new one to start managing projects
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white font-semibold text-xs hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            New Workspace
          </button>
        </div>

        {/* Workspaces Grid */}
        {workspaces.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto my-12 border border-slate-800 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Workspaces Found</h3>
              <p className="text-xs text-slate-400">
                You haven&apos;t created or joined any workspaces yet. Create one to get started!
              </p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-bg text-white font-semibold text-xs hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create First Workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws) => (
              <Link
                key={ws.id}
                href={`/workspaces/${ws.id}`}
                className="glass-card rounded-2xl p-6 border border-slate-800 glass-card-hover group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl gradient-bg text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20">
                      {ws.name[0]?.toUpperCase()}
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-slate-900 text-indigo-300 border border-slate-700/60">
                      /{ws.slug}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                      {ws.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Created {new Date(ws.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80 text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5" title="Projects">
                      <FolderKanban className="h-3.5 w-3.5 text-indigo-400" />
                      {ws._count.projects} projects
                    </span>
                    <span className="flex items-center gap-1.5" title="Members">
                      <Users className="h-3.5 w-3.5 text-purple-400" />
                      {ws._count.members} members
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
      />
    </div>
  );
}
