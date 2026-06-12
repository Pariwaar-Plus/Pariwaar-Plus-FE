"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    MapPin,
    Phone,
    HeartPulse,
    ClipboardPlus,
    History,
    Users,
    Activity,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getMyAssignments } from "@/features/care-assignment/api/care-assignment.api";
import { CareAssignment } from "@/features/care-assignment/types/care-assignment.type";
import { LogVisitModal } from "@/features/visit-log/components/log-visit-modal";
import { VisitHistoryModal } from "@/features/visit-log/components/visit-history-modal";

const STATUS_STYLE: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ON_HOLD: "bg-amber-50 text-amber-700 border-amber-200",
    COMPLETED: "bg-slate-50 text-slate-600 border-slate-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
    INACTIVE: "bg-slate-50 text-slate-500 border-slate-200",
};

function age(dob?: string) {
    if (!dob) return null;
    const d = new Date(dob);
    const now = new Date();
    let a = now.getFullYear() - d.getFullYear();
    const m = now.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
    return a;
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <Icon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}

function AssignmentCard({
    assignment,
    onLog,
    onHistory,
}: {
    assignment: CareAssignment;
    onLog: (a: CareAssignment) => void;
    onHistory: (a: CareAssignment) => void;
}) {
    const receiver = assignment.careReceiver;
    const receiverAge = age(receiver?.dateOfBirth);

    return (
        <div className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-base font-bold text-slate-800">
                        {receiver?.name ?? "Unknown receiver"}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                        {receiver?.gender}
                        {receiverAge != null ? ` · ${receiverAge} yrs` : ""}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "border text-[10px]",
                        STATUS_STYLE[assignment.status] ?? STATUS_STYLE.INACTIVE
                    )}
                >
                    {assignment.status}
                </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
                {receiver?.city && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {[receiver.tole, receiver.city].filter(Boolean).join(", ")}
                    </div>
                )}
                {receiver?.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {receiver.phone}
                    </div>
                )}
                {receiver?.medicalCondition && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {receiver.medicalCondition.split(",").map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px]">
                                {c.trim()}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onLog(assignment)}
                    disabled={!receiver}
                >
                    <ClipboardPlus className="mr-1.5 h-4 w-4" />
                    Log Visit
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onHistory(assignment)}
                    disabled={!receiver}
                >
                    <History className="mr-1.5 h-4 w-4" />
                    History
                </Button>
            </div>
        </div>
    );
}

export function CareAgentDashboard() {
    const { data: assignments = [], isLoading, isError, error } = useQuery({
        queryKey: ["my-assignments"],
        queryFn: getMyAssignments,
    });

    const [selected, setSelected] = React.useState<CareAssignment | null>(null);
    const [logOpen, setLogOpen] = React.useState(false);
    const [historyOpen, setHistoryOpen] = React.useState(false);

    const activeCount = assignments.filter((a) => a.status === "ACTIVE").length;

    const openLog = (a: CareAssignment) => {
        setSelected(a);
        setLogOpen(true);
    };
    const openHistory = (a: CareAssignment) => {
        setSelected(a);
        setHistoryOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">My Care Receivers</h2>
                <p className="text-muted-foreground">
                    The people assigned to your care. Log visits and review their history.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                <StatCard icon={Users} label="Assigned" value={assignments.length} />
                <StatCard icon={Activity} label="Active" value={activeCount} />
            </div>

            {/* States */}
            {isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                    {(error as Error)?.message ?? "Failed to load your assignments"}
                </div>
            )}

            {!isLoading && !isError && assignments.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
                    <HeartPulse className="mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium text-slate-600">No assignments yet</p>
                    <p className="mt-1 text-sm text-slate-400">
                        When an admin assigns care receivers to you, they&apos;ll appear here.
                    </p>
                </div>
            )}

            {!isLoading && !isError && assignments.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {assignments.map((a) => (
                        <AssignmentCard
                            key={a.id}
                            assignment={a}
                            onLog={openLog}
                            onHistory={openHistory}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <LogVisitModal
                assignmentId={selected?.id ?? null}
                careReceiverId={selected?.careReceiverId ?? null}
                receiverName={selected?.careReceiver?.name}
                open={logOpen}
                onOpenChange={setLogOpen}
            />
            <VisitHistoryModal
                careReceiverId={selected?.careReceiverId ?? null}
                receiverName={selected?.careReceiver?.name}
                open={historyOpen}
                onOpenChange={setHistoryOpen}
            />
        </div>
    );
}
