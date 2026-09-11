"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Phone,
    MapPin,
    Calendar,
    Activity,
    User,
    Heart,
    Users,
    AlertCircle,
    Mail,
    ClipboardList,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CareReceiver } from "../types/care-receiver.type";
import { getCareReceiverProfile } from "../api/care-receiver.api";

/* -------------------------------------------------------------------------- */
/* Placeholder types                                                           */
/* -------------------------------------------------------------------------- */

type MobilityStatus =
    | "INDEPENDENT"
    | "ASSISTED"
    | "WHEELCHAIR"
    | "BEDRIDDEN";




function getInitials(name: string) {
    if (!name) return "?";

    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

const AVATAR_COLORS = [
    "bg-emerald-100 text-emerald-700",
    "bg-sky-100 text-sky-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
];

function avatarColor(name: string) {
    return AVATAR_COLORS[
        name.charCodeAt(0) % AVATAR_COLORS.length
    ];
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const today = new Date();

    let age =
        today.getFullYear() - birthDate.getFullYear();

    const monthDiff =
        today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 &&
            today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
}

/* -------------------------------------------------------------------------- */
/* UI Helpers                                                                  */
/* -------------------------------------------------------------------------- */

function SectionLabel({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                {children}
            </span>
            <div className="flex-1 h-px bg-slate-100" />
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
        <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
            <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    {label}
                </p>

                <p
                    className={cn(
                        "text-sm",
                        value
                            ? "text-slate-800 font-medium"
                            : "text-slate-300 italic"
                    )}
                >
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
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4" />
            </div>

            <div>
                <p className="text-xs text-slate-400">
                    {label}
                </p>

                <p className="font-bold text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Mobility Badge                                                              */
/* -------------------------------------------------------------------------- */

const MOBILITY_MAP = {
    INDEPENDENT: {
        label: "Independent",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    ASSISTED: {
        label: "Assisted",
        className:
            "bg-amber-50 text-amber-700 border-amber-200",
    },
    WHEELCHAIR: {
        label:
            "bg-sky-50 text-sky-700 border-sky-200",
        className:
            "bg-amber-50 text-amber-700 border-amber-200",
    },
    BEDRIDDEN: {
        label: "Bedridden",
        className:
            "bg-red-50 text-red-700 border-red-200",
    },
};

function MobilityBadge({
    status,
}: {
    status: MobilityStatus;
}) {
    const item = MOBILITY_MAP[status];

    return (
        <span
            className={cn(
                "inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium",
                item.className
            )}
        >
            {item.label}
        </span>
    );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                    */
/* -------------------------------------------------------------------------- */

function ProfileSkeleton() {
    return (
        <div className="animate-pulse p-6 space-y-4">
            <div className="h-20 rounded-xl bg-slate-100" />
            <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="h-16 rounded-xl bg-slate-100"
                    />
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Content                                                                     */
/* -------------------------------------------------------------------------- */

function ProfileContent({
    receiver,
}: {
    receiver: CareReceiver;
}) {
    return (
        <>
            <div className="px-6 pt-6 pb-5 border-b bg-slate-50">
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center text-base font-bold shrink-0 border-2 border-white dark:border-slate-700 shadow-sm",
                        avatarColor(receiver.name)
                    )}>
                        {getInitials(receiver.name)}
                    </div>

                    <div className="flex-1">
                        <h2 className="font-bold text-lg">
                            {receiver.name}
                        </h2>

                        <p className="text-xs text-slate-400 mt-1">
                            {receiver.gender}
                        </p>

                        <div className="mt-2">
                            <MobilityBadge
                                status={
                                    receiver.mobilityStatus
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
                <div className="px-6 py-4 grid grid-cols-2 gap-3">
                    <StatCard
                        icon={Calendar}
                        label="Age"
                        value={calculateAge(
                            receiver.dateOfBirth
                        )}
                    />

                    <StatCard
                        icon={Activity}
                        label="Mobility"
                        value={
                            receiver.mobilityStatus
                        }
                    />

                    <StatCard
                        icon={Users}
                        label="Assignments"
                        value={
                            receiver.assignments
                                ?.length ?? 0
                        }
                    />

                    <StatCard
                        icon={Heart}
                        label="Blood Group"
                        value={
                            receiver.bloodGroup ??
                            "N/A"
                        }
                    />
                </div>

                <div className="px-6 pb-6 space-y-5">
                    <div>
                        <SectionLabel>
                            Personal Information
                        </SectionLabel>

                        <div className="bg-white rounded-xl border px-4">
                            <InfoRow
                                icon={User}
                                label="Name"
                                value={receiver.name}
                            />

                            <InfoRow
                                icon={Calendar}
                                label="Date of Birth"
                                value={formatDate(
                                    receiver.dateOfBirth
                                )}
                            />

                            <InfoRow
                                icon={User}
                                label="Gender"
                                value={receiver.gender}
                            />
                        </div>
                    </div>

                    <div>
                        <SectionLabel>
                            Contact & Location
                        </SectionLabel>

                        <div className="bg-white rounded-xl border px-4">
                            <InfoRow
                                icon={Phone}
                                label="Phone"
                                value={receiver.phone}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="City"
                                value={receiver.city}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="District"
                                value={
                                    receiver.district
                                }
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Ward"
                                value={receiver.ward}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Tole"
                                value={receiver.tole}
                            />
                        </div>
                    </div>

                    <div>
                        <SectionLabel>
                            Medical Information
                        </SectionLabel>

                        <div className="bg-white rounded-xl border px-4">
                            <InfoRow
                                icon={Heart}
                                label="Blood Group"
                                value={
                                    receiver.bloodGroup
                                }
                            />

                            <InfoRow
                                icon={Activity}
                                label="Condition"
                                value={
                                    receiver.medicalCondition
                                }
                            />

                            <InfoRow
                                icon={AlertCircle}
                                label="Allergies"
                                value={
                                    receiver.allergies
                                }
                            />

                            <InfoRow
                                icon={Activity}
                                label="Mobility"
                                value={
                                    receiver.mobilityStatus
                                }
                            />

                            <InfoRow
                                icon={ClipboardList}
                                label="Notes"
                                value={receiver.notes}
                            />
                        </div>
                    </div>

                    <div>
                        <SectionLabel>
                            Associated Client
                        </SectionLabel>

                        <div className="bg-white rounded-xl border px-4">
                            <InfoRow
                                icon={User}
                                label="Name"
                                value={
                                    receiver.client.user.name
                                }
                            />

                            <InfoRow
                                icon={Mail}
                                label="Email"
                                value={
                                    receiver.client.user.email
                                }
                            />

                            <InfoRow
                                icon={Phone}
                                label="Phone"
                                value={
                                    receiver.client.user.phone
                                }
                            />
                        </div>
                    </div>

                    <div>
                        <SectionLabel>
                            Assigned Care Agents
                        </SectionLabel>
                        {receiver.assignments?.map((careAgent) => (

                            <span
                                className={cn(
                                    "inline-flex items-center px-2 py-1 rounded-md border text-xs font-medium",
                                    "bg-emerald-50 text-emerald-700 border-emerald-200 mr-1"
                                )}
                                key={careAgent.id}
                            >
                                {careAgent.careAgent?.user.name}
                            </span>
                        ))}

                    </div>
                </div>
            </div>
        </>
    );
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                       */
/* -------------------------------------------------------------------------- */

interface CareReceiverProfileModalProps {
    careReceiverId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CareReceiverProfileModal({
    careReceiverId,
    open,
    onOpenChange,
}: CareReceiverProfileModalProps) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: [
            "care-receiver-profile",
            careReceiverId,
        ],
        queryFn: () =>
            getCareReceiverProfile(
                careReceiverId!
            ),
        enabled:
            !!careReceiverId && open,
    });
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-130 p-0 overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>
                        Care Receiver Profile
                    </DialogTitle>
                </VisuallyHidden>

                <button
                    onClick={() =>
                        onOpenChange(false)
                    }
                    className="absolute right-4 top-4 z-10"
                >
                </button>

                {isLoading && (
                    <ProfileSkeleton />
                )}

                {isError && (
                    <div className="p-10 text-center">
                        <p>
                            Failed to load profile
                        </p>
                        <p className="text-xs text-red-500">
                            {
                                (
                                    error as Error
                                )?.message
                            }
                        </p>
                    </div>
                )}

                {data && (
                    <ProfileContent
                        receiver={data}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}