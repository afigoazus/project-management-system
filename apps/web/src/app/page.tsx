"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { FolderKanban, ShieldCheck, Zap, Users, ArrowRight, Github } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-60 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-inner">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span>Developer Workspace v0.1 MVP Release</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Unified Platform for <br className="hidden sm:inline" />
            <span className="gradient-text">Developer Projects & Teams</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Manage your development projects, organize workspaces, collaborate with team members, and streamline your software build lifecycle from one unified dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {session ? (
              <Link
                href="/workspaces"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 shadow-xl shadow-indigo-500/25 transition-all group"
              >
                Go to Workspaces
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 shadow-xl shadow-indigo-500/25 transition-all group"
                >
                  Create Free Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass text-slate-200 font-semibold text-sm hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/80"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
            <div className="glass-card p-6 rounded-2xl glass-card-hover border border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <FolderKanban className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-1">Multi-Tenant Workspaces</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize projects cleanly into dedicated workspaces with role-based member permissions.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl glass-card-hover border border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-1">Secure Authentication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Powered by Better Auth & Fastify session validation supporting Email/Password and GitHub OAuth.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl glass-card-hover border border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-1">Team Collaboration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Invite developers, manage project repositories, and track high-level workspace activity in real-time.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-slate-800/80 py-6 px-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Developer Workspace System. All rights reserved.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-mono text-[11px]">v0.1 MVP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
