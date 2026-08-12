"use client"

import Navbar from "@/components/shared/navbar";
import Sidebar, { SidebarSkeleton } from "@/components/shared/sidebar";
import { MobileNavBar } from "@/components/shared/sidebar/mobile-nav-sidebar";
import { selectUser, useAuthStore } from "@/features/auth/store/auth.store";
import {
    ClipboardList,
    CreditCard,
    HeartHandshake,
    LayoutDashboard,
    Logs,
    LucideIcon,
    Settings,
    User,
    UserRound,
    Users
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RouteMetaData = {
    label: string;
    icon: LucideIcon;
    href: string;
    color?: string;
    activeColor?: string;
    activeBg?: string;
};

// ─── RBAC Route Configuration ─────────────────────────────────────────────────

const ROUTES_BY_ROLE: Record<string, RouteMetaData[]> = {
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
            href: "/dashboard/admin/care-assignments",
            color: "text-orange-400",
            activeColor: "text-orange-300",
            activeBg: "bg-orange-500/10 border-orange-500/30",
        },
        {
            label: "VisitLogs",
            icon: Logs,
            href: "/dashboard/admin/visit-logs",
            color: "text-orange-400",
            activeColor: "text-orange-300",
            activeBg: "bg-orange-500/10 border-orange-500/30",
        },
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/profile",
            color: "text-slate-400",
            activeColor: "text-slate-200",
            activeBg: "bg-slate-500/10 border-slate-500/30",
        },
    ],
    CARE_AGENT: [
        {
            label: "My Care Receivers",
            icon: HeartHandshake,
            href: "/dashboard/care-agent",
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
            label: "My Family",
            icon: HeartHandshake,
            href: "/dashboard/client",
            color: "text-emerald-400",
            activeColor: "text-emerald-300",
            activeBg: "bg-emerald-500/10 border-emerald-500/30",
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
};




export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = useAuthStore(selectUser);

    if (!user) return <SidebarSkeleton className="hidden md:flex w-64 flex-col fixed inset-y-0 z-80 bg-gray-900" />;

    const routes = user.role
        ? ROUTES_BY_ROLE[user.role as keyof typeof ROUTES_BY_ROLE] ?? []
        : [];



    return (
        <div className="flex h-screen overflow-hidden">
            {/* 1. Sidebar: Fixed to the left */}
            <Sidebar className="hidden md:flex w-64 flex-col fixed inset-y-0 z-80 bg-gray-900" user={user} routes={routes} />
            <MobileNavBar routes={routes} />

            {/* 2. Main Content Area */}
            <div className="md:pl-64 flex flex-col w-full h-full">
                {/* 3. Navbar: Top navigation */}
                <Navbar />

                {/* 4. Page Content: Where the Admin/Agent pages appear */}
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}