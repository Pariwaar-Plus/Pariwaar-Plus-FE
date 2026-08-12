// components/shared/sidebar/index.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/features/auth/store/auth.store";
import { RouteMetaData } from "@/app/(protected)/dashboard/layout";

// ─── Role metadata ────────────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; color: string; dot: string }> = {
    ADMIN: {
        label: "Administrator",
        color: "text-violet-400",
        dot: "bg-violet-400",
    },
    CARE_AGENT: {
        label: "Care Agent",
        color: "text-emerald-400",
        dot: "bg-emerald-400",
    },
    CLIENT: {
        label: "Client",
        color: "text-sky-400",
        dot: "bg-sky-400",
    },
};

// ─── Skeleton ────────────────────────────────────────────────────────────────

export function SidebarSkeleton({ className }: { className?: string }) {

    return (
        <div className={cn("flex flex-col h-full bg-[#0d1420]", className)}>
            {/* Logo */}
            <div className="px-5 pt-6 pb-5 border-b border-white/6">
                <div className="h-7 w-28 bg-white/6 animate-pulse rounded-lg" />
            </div>
            {/* Nav items */}
            <div className="flex-1 px-3 pt-5 space-y-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-10 w-full bg-white/4 animate-pulse rounded-xl"
                        style={{ animationDelay: `${i * 80}ms` }}
                    />
                ))}
            </div>
            {/* Footer */}
            <div className="px-4 py-4 border-t border-white/6">
                <div className="h-10 w-full bg-white/4 animate-pulse rounded-xl" />
            </div>
        </div>
    );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function Sidebar({ className, user, routes }: { className?: string, user: User, routes: RouteMetaData[] }) {
    const pathname = usePathname();
    const roleMeta = user.role ? ROLE_META[user.role] : null;
    const displayName = user.name || user.email;
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    return (
        <div className={cn(
            "flex flex-col h-full w-64 bg-[#0d1420] border-r border-white/6",
            className
        )}>

            {/* ── Logo ── */}
            <div className="px-5 pt-6 pb-5 border-b border-white/6">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-600/30 transition-colors">
                        {/* Heart + plus icon */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z"
                                fill="rgba(52,211,153,0.3)"
                                stroke="rgb(52,211,153)"
                                strokeWidth="1.5"
                            />
                            <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z" fill="rgb(52,211,153)" />
                        </svg>
                    </div>
                    <span className="font-bold text-[1.1rem] text-white tracking-tight">
                        Pariwaar<span className="text-emerald-400">+</span>
                    </span>
                </Link>
            </div>

            {/* ── Nav section label ── */}
            <div className="px-5 pt-5 pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Navigation
                </p>
            </div>

            {/* ── Nav links ── */}
            <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
                {routes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border",
                                isActive
                                    ? cn("text-white border", route.activeBg ?? "bg-white/10 border-white/10")
                                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5"
                            )}
                        >
                            {/* Active indicator bar */}
                            <span className={cn(
                                "absolute left-0 w-0.75 h-5 rounded-r-full transition-all",
                                isActive ? "opacity-100" : "opacity-0"
                            )} />

                            <route.icon
                                className={cn(
                                    "h-4.5 w-4.5 shrink-0 transition-colors",
                                    isActive
                                        ? (route.activeColor ?? "text-white")
                                        : (route.color ?? "text-slate-500")
                                )}
                                size={18}
                            />

                            <span className="truncate">{route.label}</span>

                            {/* Active dot */}
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── User footer ── */}
            <div className="px-3 py-3 border-t border-white/6">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-default">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-emerald-400">{initials}</span>
                    </div>

                    {/* Name + role */}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
                            {displayName}
                        </p>
                        {roleMeta && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", roleMeta.dot)} />
                                <span className={cn("text-[10px] font-medium truncate", roleMeta.color)}>
                                    {roleMeta.label}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}