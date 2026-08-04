"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LayoutGrid, LogOut, User, FolderKanban, Plus } from "lucide-react";

export function Navbar({ onOpenCreateWorkspace }: { onOpenCreateWorkspace?: () => void }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <nav className="glass sticky top-0 z-40 w-full border-b border-slate-800/80 px-6 py-3.5 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Brand */}
        <Link href="/workspaces" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-bg text-white shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-105">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              Developer <span className="gradient-text">Workspace</span>
            </span>
          </div>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          {!isPending && session ? (
            <>
              <Link
                href="/workspaces"
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/60"
              >
                <LayoutGrid className="h-4 w-4 text-indigo-400" />
                Workspaces
              </Link>

              {onOpenCreateWorkspace && (
                <button
                  onClick={onOpenCreateWorkspace}
                  className="flex items-center gap-1.5 text-xs font-semibold gradient-bg text-white px-3 py-2 rounded-lg hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  New Workspace
                </button>
              )}

              {/* User Profile dropdown or menu */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <div className="flex items-center gap-2.5">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-8 w-8 rounded-full border border-indigo-500/30 object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-semibold text-xs">
                      {session.user.name?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-medium text-slate-300">
                    {session.user.name || session.user.email}
                  </span>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : !isPending ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs font-semibold gradient-bg text-white px-3.5 py-2 rounded-lg hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all"
              >
                Get Started
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
