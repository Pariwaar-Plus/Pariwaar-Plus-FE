"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    MapPin,
    Phone,
    Heart,
    Activity,
    AlertCircle,
    History,
    Info,
    Users,
    HeartPulse,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { CareReceiver } from "@/features/care-receiver/types/care-receiver.type";
import { VisitHistoryModal } from "@/features/visit-log/components/visit-history-modal";
import { getCareReceivers } from "@/features/care-receiver/api/care-receiver.api";
import { HealthDashboard } from "./health-dashboard";

const MOBILITY_STYLE: Record<string, string> = {
    INDEPENDENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ASSISTED: "bg-amber-50 text-amber-700 border-amber-200",
    WHEELCHAIR: "bg-sky-50 text-sky-700 border-sky-200",
    BEDRIDDEN: "bg-red-50 text-red-700 border-red-200",
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

function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex items-start gap-3 border-b border-slate-50 py-2.5 last:border-0">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
                <Icon className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
                <p
                    className={cn(
                        "text-sm",
                        value ? "font-medium text-slate-800" : "italic text-slate-300"
                    )}
                >
                    {value ?? "—"}
                </p>
            </div>
        </div>
    );
}

function DetailsModal({
    receiver,
    open,
    onOpenChange,
}: {
    receiver: CareReceiver | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-130">
                <DialogHeader>
                    <DialogTitle>{receiver?.name ?? "Care Receiver"}</DialogTitle>
                    <DialogDescription>Profile details</DialogDescription>
                </DialogHeader>

                {receiver && (
                    <div className="max-h-[60vh] overflow-y-auto rounded-xl border px-4">
                        <DetailRow icon={MapPin} label="Location" value={[receiver.tole, receiver.ward, receiver.city].filter(Boolean).join(", ")} />
                        <DetailRow icon={Phone} label="Phone" value={receiver.phone} />
                        <DetailRow icon={Heart} label="Blood Group" value={receiver.bloodGroup} />
                        <DetailRow icon={Activity} label="Condition" value={receiver.medicalCondition} />
                        <DetailRow icon={AlertCircle} label="Allergies" value={receiver.allergies} />
                        <DetailRow icon={Activity} label="Mobility" value={receiver.mobilityStatus} />
                        <DetailRow icon={Phone} label="Emergency Contact" value={receiver.emergencyContactName && receiver.emergencyContactPhone ? `${receiver.emergencyContactName} · ${receiver.emergencyContactPhone}` : receiver.emergencyContactName} />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function ReceiverCard({
    receiver,
    onUpdates,
    onDetails,
}: {
    receiver: CareReceiver;
    onUpdates: (r: CareReceiver) => void;
    onDetails: (r: CareReceiver) => void;
}) {
    const a = age(receiver.dateOfBirth);
    return (
        <div className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-base font-bold text-slate-800">{receiver.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">
                        {receiver.gender}
                        {a != null ? ` · ${a} yrs` : ""}
                    </p>
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "border text-[10px]",
                        MOBILITY_STYLE[receiver.mobilityStatus] ?? MOBILITY_STYLE.INDEPENDENT
                    )}
                >
                    {receiver.mobilityStatus}
                </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-600">
                {/* {receiver.city && (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {[receiver.tole, receiver.city].filter(Boolean).join(", ")}
                    </div>
                )} */}
                {receiver.medicalCondition && (
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
                <Button size="sm" className="flex-1" onClick={() => onUpdates(receiver)}>
                    <History className="mr-1.5 h-4 w-4" />
                    View Updates
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => onDetails(receiver)}
                >
                    <Info className="mr-1.5 h-4 w-4" />
                    Details
                </Button>
            </div>
        </div>
    );
}

export function ClientDashboard() {
    // const { data: receivers = [], isLoading, isError, error } = useQuery({
    //     queryKey: ["my-care-receivers"],
    //     queryFn: getCareReceivers,
    // });

    // const [selected, setSelected] = React.useState<CareReceiver | null>(null);
    // const [updatesOpen, setUpdatesOpen] = React.useState(false);
    // const [detailsOpen, setDetailsOpen] = React.useState(false);

    // const openUpdates = (r: CareReceiver) => {
    //     setSelected(r);
    //     setUpdatesOpen(true);
    // };
    // const openDetails = (r: CareReceiver) => {
    //     setSelected(r);
    //     setDetailsOpen(true);
    // };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">My Family</h2>
                <p className="text-muted-foreground">
                    Your loved ones under Pariwaar+ care, and their latest health updates.
                </p>
            </div>
{/* 
            <div className="grid grid-cols-1 gap-4 sm:max-w-xs">
                <StatCard icon={Users} label="Care Receivers" value={receivers.length} />
            </div>

            {isLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
                    {(error as Error)?.message ?? "Failed to load your care receivers"}
                </div>
            )}

            {!isLoading && !isError && receivers.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-center">
                    <HeartPulse className="mb-3 h-10 w-10 text-slate-300" />
                    <p className="font-medium text-slate-600">No care receivers yet</p>
                    <p className="mt-1 text-sm text-slate-400">
                        Once your family member is registered, they&apos;ll appear here.
                    </p>
                </div>
            )}

            {!isLoading && !isError && receivers.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {receivers.map((r) => (
                        <ReceiverCard
                            key={r.id}
                            receiver={r}
                            onUpdates={openUpdates}
                            onDetails={openDetails}
                        />
                    ))}
                </div>
            )}

            <VisitHistoryModal
                careReceiverId={selected?.id ?? null}
                receiverName={selected?.name}
                open={updatesOpen}
                onOpenChange={setUpdatesOpen}
            />
            <DetailsModal
                receiver={selected}
                open={detailsOpen}
                onOpenChange={setDetailsOpen}
            /> */}
            <HealthDashboard/>
        </div>
    );
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
                <Icon className="h-5 w-5 text-sky-600" />
            </div>
            <div>
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-xl font-bold text-slate-800">{value}</p>
            </div>
        </div>
    );
}
