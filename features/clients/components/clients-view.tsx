// features/clients/components/client-view.tsx
"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

import { AddClientModal } from "./add-client-modal";
import { ClientList } from "./client-list";
import { AddActionButton } from "../../../components/shared/buttons/add-action-button.component";
import { getClients } from "../api/client.api";

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
    label: string;
    value: number | string;
    icon: React.ElementType;
    iconClass: string;
    iconBg: string;
    loading?: boolean;
}

function StatCard({ label, value, icon: Icon, iconClass, iconBg, loading }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-4 flex items-center gap-4 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
                <Icon className={cn("w-5 h-5", iconClass)} />
            </div>
            <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {label}
                </p>
                {loading ? (
                    <div className="h-5 w-10 bg-slate-100 dark:bg-slate-800 rounded animate-pulse mt-1" />
                ) : (
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight mt-0.5">
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ClientView() {
    const [open, setOpen] = React.useState(false);

    const { data: clients = [], isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: getClients,
    });

    const totalClients    = clients.length;
    const paidClients     = clients.filter((c) => c.paymentStatus === "PAID").length;
    const overdueClients  = clients.filter((c) => c.paymentStatus === "OVERDUE").length;
    const totalReceivers  = clients.reduce(
    (sum, c) => sum + (c.careReceivers?.length ?? 0), 0
    );

    return (
        <div className="space-y-6">

            {/* ── Page header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Clients
                        </h1>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-500 ml-3.5">
                        Manage Nepalese and NRN families enrolled in Pariwaar+
                    </p>
                </div>  

                <AddActionButton label="Add Client" onClick={() => setOpen(true)} />
                
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Total Clients"
                    value={totalClients}
                    icon={Users}
                    iconBg="bg-slate-100 dark:bg-slate-800"
                    iconClass="text-slate-500 dark:text-slate-400"
                    loading={isLoading}
                />
                <StatCard
                    label="Paid"
                    value={paidClients}
                    icon={UserCheck}
                    iconBg="bg-emerald-50 dark:bg-emerald-900/30"
                    iconClass="text-emerald-600 dark:text-emerald-400"
                    loading={isLoading}
                />
                <StatCard
                    label="Overdue"
                    value={overdueClients}
                    icon={UserX}
                    iconBg="bg-red-50 dark:bg-red-900/30"
                    iconClass="text-red-500 dark:text-red-400"
                    loading={isLoading}
                />
                <StatCard
                    label="Care Receivers"
                    value={totalReceivers}
                    icon={TrendingUp}
                    iconBg="bg-violet-50 dark:bg-violet-900/30"
                    iconClass="text-violet-600 dark:text-violet-400"
                    loading={isLoading}
                />
            </div>

            {/* ── List ── */}
            <ClientList />

            {/* ── Modal ── */}
            <AddClientModal open={open} onOpenChange={setOpen} />
        </div>
    );
}