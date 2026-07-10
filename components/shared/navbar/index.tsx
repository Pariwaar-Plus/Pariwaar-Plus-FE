"use client";

import { useAuthStore, selectUser } from "@/features/auth/store/auth.store";
import { UserButton } from "./user-button";
import { Bell, Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";


const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
    ADMIN: {
        label: "Admin Portal",
        color: "text-violet-700 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800",
        dot: "bg-violet-500",
    },
    CARE_AGENT: {
        label: "Staff Workspace",
        color: "text-emerald-700 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
        dot: "bg-emerald-500",
    },
    CLIENT: {
        label: "Client Portal",
        color: "text-sky-700 dark:text-sky-400",
        bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800",
        dot: "bg-sky-500",
    },
};

const ADMIN_STATUS_MESSAGES = [
    "System looks healthy today.",
    "All services are operational.",
    "No active incidents.",
];

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
}


export default function Navbar() {
    const user = useAuthStore(selectUser);

    const greeting = getGreeting();
    const displayName = user?.name?.split(" ")[0] || "there";
    const role = user?.role as keyof typeof ROLE_CONFIG | undefined;
    const roleConfig = role ? ROLE_CONFIG[role] : null;

    // Random stable status message for admin (stable across renders)
    const adminMsg = ADMIN_STATUS_MESSAGES[0];

    const subText = role === "ADMIN"
        ? adminMsg
        : role === "CARE_AGENT"
            ? "Your assignments are up to date."
            : "Welcome back to Pariwaar+";

    return (
        <nav className="sticky top-0 z-50 h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0f1623]/90 backdrop-blur-md">
            <div className="flex h-full items-center justify-between px-5 gap-4">

                {/* ── LEFT: Greeting ── */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Vertical accent bar */}
                    <div className="hidden sm:block w-0.75 h-8 rounded-full bg-linear-to-b from-emerald-400 to-emerald-700 shrink-0" />

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">
                            {greeting},{" "}
                            <span className="text-emerald-600 dark:text-emerald-400">
                                {displayName}
                            </span>
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight truncate flex items-center gap-1 mt-0.5">
                            {role === "ADMIN" && (
                                <Activity className="w-3 h-3 text-emerald-500 shrink-0" />
                            )}
                            {subText}
                        </p>
                    </div>
                </div>

                {/* ── RIGHT: Role badge + notifications + user ── */}
                <div className="flex items-center gap-2.5 shrink-0">

                    {/* Role badge */}
                    {roleConfig && (
                        <div className={cn(
                            "hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-semibold tracking-wide uppercase",
                            roleConfig.bg, roleConfig.color
                        )}>
                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", roleConfig.dot)} />
                            {roleConfig.label}
                        </div>
                    )}

                    {/* Session indicator */}
                    <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {user ? "Secure session" : "Connecting…"}
                        </span>
                    </div>

                    {/* Notification bell */}
                    <button
                        className="relative flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4" />
                        {/* Notification dot */}
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border-2 border-white dark:border-slate-800" />
                    </button>

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

                    {/* User button */}
                    <UserButton />
                </div>
            </div>
        </nav>
    );
}