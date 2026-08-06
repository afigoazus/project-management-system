"use client";

import { useState } from "react";
import { useCreateWorkspace } from "../hooks/workspace.hook";
import { X, Building2, Sparkles, Loader2 } from "lucide-react";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateWorkspaceModal({ isOpen, onClose, onSuccess }: CreateWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  const createWorkspaceMutation = useCreateWorkspace();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    createWorkspaceMutation.mutate(
      {
        name,
        slug: slug.trim() || undefined as unknown as string,
      },
      {
        onSuccess: () => {
          setName("");
          setSlug("");
          onSuccess?.();
          onClose();
        },
        onError: (err: unknown) => {
          setError(err instanceof Error ? err.message : "Failed to create workspace");
        },
      }
    );
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="glass-card w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-700/80 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl gradient-bg text-white shadow-lg shadow-indigo-500/20">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create Workspace</h3>
            <p className="text-xs text-slate-400">Set up a space for your team and projects</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Workspace Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Corp Developer Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Workspace Slug <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. acme-dev-hub"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Used in URLs. Leave blank to generate automatically.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createWorkspaceMutation.isPending || !name.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-semibold text-xs hover:opacity-90 disabled:opacity-50 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {createWorkspaceMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Workspace
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
