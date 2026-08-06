"use client";

import { useState } from "react";
import { X, UserPlus, Mail, Loader2, Shield } from "lucide-react";
import { useAddWorkspaceMember } from "../hooks/workspace.hook";

interface AddMemberModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMemberModal({ workspaceId, isOpen, onClose, onSuccess }: AddMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER">("MEMBER");
  const addMemberMutation = useAddWorkspaceMember(workspaceId);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addMemberMutation.mutate(email, {
      onSuccess: () => {
        setEmail("");
        setRole("MEMBER");
        onSuccess();
        onClose();
      },
    });
  };

  const error = addMemberMutation.error
    ? addMemberMutation.error.message
    : "";

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
            <UserPlus className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Add Workspace Member</h3>
            <p className="text-xs text-slate-400">Invite registered users to collaborate</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              Member Email <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="developer@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "MEMBER")}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="MEMBER">Member (Can view & create projects)</option>
              <option value="ADMIN">Admin (Full workspace permissions)</option>
            </select>
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
              disabled={addMemberMutation.isPending || !email.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white font-semibold text-xs hover:opacity-90 disabled:opacity-50 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              {addMemberMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
