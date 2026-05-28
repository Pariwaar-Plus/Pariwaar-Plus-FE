// components/shared/sidebar/index.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, Users, UserRound, CreditCard,
    ClipboardList, Settings, HeartHandshake, User,
    LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, selectUser } from "@/features/auth/store/auth.store";

// ─── Types ────────────────────────────────────────────────────────────────────

type Route = {
    label: string;
    icon: LucideIcon;
    href: string;
    color?: string;
    activeColor?: string;
    activeBg?: string;
};

// ─── RBAC Route Configuration ─────────────────────────────────────────────────

const ROUTES_BY_ROLE: Record<string, Route[]> = {
    ADMIN: [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/admin",
            color: "text-sky-400",
            activeColor: "text-sky-300",
            activeBg: "bg-sky-500/10 border-sky-500/30",
        },
        {
            label: "Sahara Staff",
            icon: UserRound,
            href: "/dashboard/admin/care-agents",
            color: "text-violet-400",
            activeColor: "text-violet-300",
            activeBg: "bg-violet-500/10 border-violet-500/30",
        },
        {
            label: "Clients",
            icon: CreditCard,
            href: "/dashboard/admin/clients",
            color: "text-emerald-400",
            activeColor: "text-emerald-300",
            activeBg: "bg-emerald-500/10 border-emerald-500/30",
        },
        {
            label: "Care Receivers",
            icon: Users,
            href: "/dashboard/admin/care-receivers",
            color: "text-pink-400",
            activeColor: "text-pink-300",
            activeBg: "bg-pink-500/10 border-pink-500/30",
        },
        {
            label: "Assignments",
            icon: ClipboardList,
            href: "/dashboard/admin/assignments",
            color: "text-orange-400",
            activeColor: "text-orange-300",
            activeBg: "bg-orange-500/10 border-orange-500/30",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/admin/settings",
            color: "text-slate-400",
            activeColor: "text-slate-200",
            activeBg: "bg-slate-500/10 border-slate-500/30",
        },
    ],
    CARE_AGENT: [
        {
            label: "My Assignments",
            icon: ClipboardList,
            href: "/dashboard/my-tasks",
            color: "text-orange-400",
            activeColor: "text-orange-300",
            activeBg: "bg-orange-500/10 border-orange-500/30",
        },
        {
            label: "Care Receivers",
            icon: HeartHandshake,
            href: "/dashboard/patients",
            color: "text-pink-400",
            activeColor: "text-pink-300",
            activeBg: "bg-pink-500/10 border-pink-500/30",
        },
        {
            label: "Profile",
            icon: User,
            href: "/dashboard/profile",
            color: "text-slate-400",
            activeColor: "text-slate-200",
            activeBg: "bg-slate-500/10 border-slate-500/30",
        },
    ],
    CLIENT: [
        {
            label: "Portal Home",
            icon: LayoutDashboard,
            href: "/dashboard/portal",
            color: "text-emerald-400",
            activeColor: "text-emerald-300",
            activeBg: "bg-emerald-500/10 border-emerald-500/30",
        },
        {
            label: "My Care Plan",
            icon: ClipboardList,
            href: "/dashboard/plan",
            color: "text-sky-400",
            activeColor: "text-sky-300",
            activeBg: "bg-sky-500/10 border-sky-500/30",
        },
        {
            label: "Billing",
            icon: CreditCard,
            href: "/dashboard/billing",
            color: "text-violet-400",
            activeColor: "text-violet-300",
            activeBg: "bg-violet-500/10 border-violet-500/30",
        },
    ],
};

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

function SidebarSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col h-full bg-[#0d1420]", className)}>
            {/* Logo */}
            <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
                <div className="h-7 w-28 bg-white/[0.06] animate-pulse rounded-lg" />
            </div>
            {/* Nav items */}
            <div className="flex-1 px-3 pt-5 space-y-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className="h-10 w-full bg-white/[0.04] animate-pulse rounded-xl"
                        style={{ animationDelay: `${i * 80}ms` }}
                    />
                ))}
            </div>
            {/* Footer */}
            <div className="px-4 py-4 border-t border-white/[0.06]">
                <div className="h-10 w-full bg-white/[0.04] animate-pulse rounded-xl" />
            </div>
        </div>
    );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────

export default function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const user = useAuthStore(selectUser);

    if (!user) return <SidebarSkeleton className={className} />;

    const routes = user.role
        ? ROUTES_BY_ROLE[user.role as keyof typeof ROUTES_BY_ROLE] ?? []
        : [];

    const roleMeta = user.role ? ROLE_META[user.role] : null;
    const displayName = user.name || user.email;
    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    return (
        <div className={cn(
            "flex flex-col h-full w-64 bg-[#0d1420] border-r border-white/[0.06]",
            className
        )}>

            {/* ── Logo ── */}
            <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600/30 transition-colors">
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
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
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
                                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.05]"
                            )}
                        >
                            {/* Active indicator bar */}
                            <span className={cn(
                                "absolute left-0 w-[3px] h-5 rounded-r-full transition-all",
                                isActive ? "opacity-100" : "opacity-0"
                            )} />

                            <route.icon
                                className={cn(
                                    "h-4.5 w-4.5 flex-shrink-0 transition-colors",
                                    isActive
                                        ? (route.activeColor ?? "text-white")
                                        : (route.color ?? "text-slate-500")
                                )}
                                size={18}
                            />

                            <span className="truncate">{route.label}</span>

                            {/* Active dot */}
                            {isActive && (
                                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/40 flex-shrink-0" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* ── User footer ── */}
            <div className="px-3 py-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-colors cursor-default">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-emerald-400">{initials}</span>
                    </div>

                    {/* Name + role */}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-200 truncate leading-tight">
                            {displayName}
                        </p>
                        {roleMeta && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", roleMeta.dot)} />
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