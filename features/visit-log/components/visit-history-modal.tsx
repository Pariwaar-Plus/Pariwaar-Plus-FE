"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Activity,
    Droplet,
    HeartPulse,
    Pill,
    Thermometer,
    Wind,
    Gauge,
    Scale,
    StickyNote,
    CalendarClock,
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { getVisitHistory } from "../api/visit-log.api";
import { VisitLog, VisitStatus } from "../types/visit-log.type";

const STATUS_STYLE: Record<VisitStatus, string> = {
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    SCHEDULED: "bg-sky-50 text-sky-700 border-sky-200",
    MISSED: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

function Vital({
    icon: Icon,
    label,
    value,
    unit,
}: {
    icon: React.ElementType;
    label: string;
    value: number | string | null | undefined;
    unit?: string;
}) {
    if (value === null || value === undefined || value === "") return null;
    return (
        <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                    {label}
                </p>
                <p className="text-sm font-semibold text-slate-800">
                    {value}
                    {unit ? <span className="text-xs font-normal text-slate-400"> {unit}</span> : null}
                </p>
            </div>
        </div>
    );
}

function NoteBlock({ label, value }: { label: string; value?: string | null }) {
    if (!value) return null;
    return (
        <div className="text-sm">
            <span className="font-medium text-slate-500">{label}: </span>
            <span className="text-slate-700">{value}</span>
        </div>
    );
}

function bpValue(v: VisitLog) {
    if (v.bloodPressureSystolic == null && v.bloodPressureDiastolic == null) return null;
    return `${v.bloodPressureSystolic ?? "–"}/${v.bloodPressureDiastolic ?? "–"}`;
}

export function VisitCard({ visit }: { visit: VisitLog }) {
    const when = visit.checkInAt ?? visit.scheduledAt;
    const upto = visit.checkOutAt
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarClock className="h-4 w-4 text-slate-400" />
                    {when ? format(new Date(when), "PPP p") : "—"} {upto ? "to" : "-"} {upto ? format(new Date(upto), "HH:mm") : ""}
                </div>
                <Badge
                    variant="outline"
                    className={cn("border text-xs", STATUS_STYLE[visit.status])}
                >
                    {visit.status}
                </Badge>
            </div>

            {visit.status === "CANCELLED" || visit.status === "MISSED" ? (
                visit.cancellationReason ? (
                    <p className="mb-3 text-sm text-amber-700">
                        Reason: {visit.cancellationReason}
                    </p>
                ) : null
            ) : (
                <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <Vital icon={HeartPulse} label="BP" value={bpValue(visit)} unit="mmHg" />
                    <Vital icon={Activity} label="Pulse" value={visit.pulseRate} unit="bpm" />
                    <Vital icon={Thermometer} label="Temp" value={visit.temperature} unit="°C" />
                    <Vital icon={Wind} label="SpO₂" value={visit.oxygenSaturation} unit="%" />
                    <Vital icon={Droplet} label="Sugar" value={visit.bloodSugar} unit="mg/dL" />
                    <Vital icon={Gauge} label="Resp" value={visit.respiratoryRate} unit="/min" />
                    <Vital icon={Scale} label="Weight" value={visit.weight} unit="kg" />
                    <Vital icon={Activity} label="Pain" value={visit.painLevel} unit="/10" />
                    <Vital icon={HeartPulse} label="Mood" value={visit.mood} />
                </div>
            )}

            {(visit.medicationsGiven ||
                visit.medicationsSkipped ||
                visit.symptoms ||
                visit.agentNotes) && (
                    <div className="space-y-1.5 border-t border-slate-100 pt-3">
                        {visit.medicationsGiven && (
                            <div className="flex items-start gap-2 text-sm">
                                <Pill className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                <span className="text-slate-700">{visit.medicationsGiven}</span>
                            </div>
                        )}
                        <NoteBlock label="Skipped meds" value={visit.medicationsSkipped} />
                        <NoteBlock label="Symptoms" value={visit.symptoms} />
                        {visit.agentNotes && (
                            <div className="flex items-start gap-2 text-sm">
                                <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                                <span className="text-slate-700">{visit.agentNotes}</span>
                            </div>
                        )}
                    </div>
                )}
        </div>
    );
}

interface VisitHistoryModalProps {
    careReceiverId: string | null;
    visitId?: string | null;
    receiverName?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VisitHistoryModal({
    careReceiverId,
    receiverName,
    open,
    onOpenChange,
}: VisitHistoryModalProps) {

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["visit-history", careReceiverId],
        queryFn: () => getVisitHistory(careReceiverId!),
        enabled: !!careReceiverId && open,
    });

    const visits = data ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>Visit History</DialogTitle>
                    <DialogDescription>
                        {receiverName
                            ? `Recorded visits for ${receiverName}.`
                            : "Recorded visits and health updates."}
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
                    {isLoading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="h-28 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    )}

                    {isError && (
                        <div className="p-6 text-center text-sm text-red-500">
                            {(error as Error)?.message ?? "Failed to load visit history"}
                        </div>
                    )}

                    {!isLoading && !isError && visits.length === 0 && (
                        <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-400">
                            No visits recorded yet.
                        </div>
                    )}

                    {visits.map((visit) => (
                        <VisitCard key={visit.id} visit={visit} />
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
