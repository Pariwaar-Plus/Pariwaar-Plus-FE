"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Mail, Phone, Globe, Clock, MapPin,
    CreditCard, Users, X, AlertCircle,
    User, Calendar, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getClientProfile } from "../api/client.api";
import { Client, PaymentStatus, BillingType } from "../types/client.type";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@/components/ui/dialog";


function getInitials(name: string) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-teal-100 text-teal-700",
];

function avatarColor(name: string) {
    if (!name) return AVATAR_COLORS[0];
    return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
    });
}


function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {children}
            </span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
        </div>
    );
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0">
            <div className="w-7 h-7 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
                {label}
            </p>
            <p className={cn(
                "text-sm",
                value
                ? "text-slate-800 dark:text-slate-100 font-medium"
                : "text-slate-300 dark:text-slate-600 italic"
            )}>
                {value ?? "—"}
            </p>
            </div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    color = "emerald",
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color?: "emerald" | "sky" | "amber" | "violet";
}) {
    const colorMap = {
        emerald: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
        sky:     "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400",
        amber:   "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
        violet:  "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400",
    };
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", colorMap[color])}>
            <Icon className="w-4 h-4" />
            </div>
            <div>
            <p className="text-xs text-slate-400 dark:text-slate-500">{label}</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">{value}</p>
            </div>
        </div>
    );
}

const PAYMENT_MAP: Record<PaymentStatus, { label: string; className: string }> = {
    PAID:      { label: "Paid",      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
    PENDING:   { label: "Pending",   className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800" },
    OVERDUE:   { label: "Overdue",   className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
    CANCELLED: { label: "Cancelled", className: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
};

function PaymentBadge({ status }: { status: PaymentStatus }) {
    const { label, className } = PAYMENT_MAP[status] ?? PAYMENT_MAP.PENDING;
    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
            className
        )}>
            {label}
        </span>
    );
}

function ProfileSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 w-48 rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-5 w-20 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>
            </div>
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800" />
            ))}
            </div>
            <div className="px-6 pb-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 rounded-lg bg-slate-100 dark:bg-slate-800" />
            ))}
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Profile content
───────────────────────────────────────────── */

function ProfileContent({ client }: { client: Client }) {
    const billingLabel: Record<BillingType, string> = {
        MONTHLY:   "Monthly",
        QUARTERLY: "Quarterly",
        YEARLY:    "Yearly",
    };

    const joinedDaysAgo = React.useMemo(() => {
        if (!client.createdAt) return 0;
        return Math.floor(
            (new Date().getTime() - new Date(client.createdAt).getTime()) /
            (1000 * 60 * 60 * 24)
        );
    }, [client.createdAt]);

    return (
        <>
            {/* ── Header ── */}
            <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-start gap-4">
                <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-sm",
                avatarColor(client.name)
                )}>
                {getInitials(client.name)}
                </div>
                <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                        {client.name}
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {client.email}
                    </p>
                    </div>
                    <PaymentBadge status={client.paymentStatus} />
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {client.country}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {client.timezone}
                    </span>
                </div>
                </div>
            </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto max-h-[60vh]">

            {/* ── Stats ── */}
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
                <StatCard
                icon={Users}
                label="Care Receivers"
                value={client.careReceivers?.length ?? 0}
                color="emerald"
                />
                <StatCard
                icon={CreditCard}
                label="Billing"
                value={billingLabel[client.billingType]}
                color="violet"
                />
                <StatCard
                icon={Activity}
                label="Payment Status"
                value={PAYMENT_MAP[client.paymentStatus].label}
                color={
                    client.paymentStatus === "PAID"    ? "emerald" :
                    client.paymentStatus === "OVERDUE" ? "amber"   : "sky"
                }
                />
                <StatCard
                icon={Calendar}
                label="Days as Client"
                value={joinedDaysAgo}
                color="sky"
                />
            </div>

            <div className="px-6 pb-6 space-y-5">

                {/* ── Contact ── */}
                <div>
                <SectionLabel>Contact</SectionLabel>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 divide-y divide-slate-50 dark:divide-slate-800/60">
                    <InfoRow icon={Phone} label="Primary Phone"   value={`${client.countryCode} ${client.phone}`} />
                    <InfoRow icon={Phone} label="Secondary Phone" value={client.secondaryPhone} />
                    <InfoRow icon={Mail}  label="Email"           value={client.email} />
                </div>
                </div>

                {/* ── Location ── */}
                <div>
                <SectionLabel>Location Abroad</SectionLabel>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 divide-y divide-slate-50 dark:divide-slate-800/60">
                    <InfoRow icon={Globe}  label="Country"  value={client.country} />
                    <InfoRow icon={Clock}  label="Timezone" value={client.timezone} />
                    <InfoRow icon={MapPin} label="City"     value={client.city} />
                    <InfoRow icon={MapPin} label="Address"  value={client.address} />
                </div>
                </div>

                {/* ── Care Receivers ── */}
                {client.careReceivers && client.careReceivers.length > 0 && (
                <div>
                    <SectionLabel>Care Receivers</SectionLabel>
                    <div className="space-y-2">
                    {client.careReceivers.map((receiver) => (
                        <div
                        key={receiver.id}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3 flex items-center gap-3"
                        >
                        <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {receiver.name}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                            {receiver.city}
                            {receiver.gender && ` · ${receiver.gender.charAt(0) + receiver.gender.slice(1).toLowerCase()}`}
                            </p>
                        </div>
                        <span className={cn(
                            "text-[10px] font-medium px-2 py-0.5 rounded-md border",
                            receiver.mobilityStatus === "INDEPENDENT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : receiver.mobilityStatus === "BEDRIDDEN"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                            {receiver.mobilityStatus?.replace("_", " ")}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {/* ── Account ── */}
                <div>
                <SectionLabel>Account</SectionLabel>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 px-4 divide-y divide-slate-50 dark:divide-slate-800/60">
                    <InfoRow icon={Calendar} label="Client Since"  value={formatDate(client.createdAt)} />
                    <InfoRow icon={Calendar} label="Last Updated"  value={formatDate(client.updatedAt)} />
                </div>
                </div>

            </div>
            </div>
        </>
    );
}


interface ClientProfileModalProps {
    clientId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ClientProfileModal({
    clientId,
    open,
    onOpenChange,
}: ClientProfileModalProps) {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["client-profile", clientId],
        queryFn:  () => getClientProfile(clientId!),
        enabled:  !!clientId && open,
        staleTime: 1000 * 60 * 2,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
            <VisuallyHidden>
                <DialogTitle>Client Profile</DialogTitle>
            </VisuallyHidden>

            {/* ── Close button ── */}
            <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-10 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
            >
            <X className="w-4 h-4" />
            </button>

            {isLoading && <ProfileSkeleton />}

            {isError && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Failed to load profile
                </p>
                <p className="text-xs text-slate-400 mt-1">
                {(error as Error)?.message ?? "Something went wrong"}
                </p>
            </div>
            )}

            {data && <ProfileContent client={data} />}

        </DialogContent>
        </Dialog>
    );
}