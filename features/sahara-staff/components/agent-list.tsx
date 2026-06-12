"use client";

import * as React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Mail, Phone, MapPin, Briefcase,
    MoreHorizontal, Eye, Pencil, Trash2,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { getCareAgents, deleteCareAgent } from "@/features/sahara-staff/api/care-agent.api";
import { CareAgent, CareAgentStatus } from "@/features/sahara-staff/types/sahara-staff.type";

import { DeleteConfirmDialog } from "@/components/shared/dialogs/delete-confirm-dialogue.component";
import { EditSaharaSheet } from "@/features/sahara-staff/components/edit-sahara-sheet";
import { SearchFilter } from "@/components/shared/filter/search-filter.component";
import { CareAgentProfileModal } from "@/features/sahara-staff/components/sahara-staff-profile-modal";

/* ── Helpers ── */

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
    "bg-teal-100 text-teal-700",
];

function avatarColor(name: string) {
    if (!name) return AVATAR_COLORS[0];
    const index = name.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
}

/* ── Sub-components ── */

function StatusBadge({ status }: { status: CareAgentStatus }) {
    const map: Record<CareAgentStatus, { label: string; className: string }> = {
        AVAILABLE: { label: "Available", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
        ASSIGNED: { label: "Assigned", className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800" },
        ON_LEAVE: { label: "On Leave", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800" },
        INACTIVE: { label: "Inactive", className: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
    };

    const { label, className } = map[status] ?? map.INACTIVE;

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
            className
        )}>
            {label}
        </span>
    );
}

function TableSkeleton() {
    return (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3.5 animate-pulse">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800" />
                        <div className="h-2.5 w-48 rounded bg-slate-100 dark:bg-slate-800" />
                    </div>
                    <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                    <div className="h-6 w-6 rounded bg-slate-100 dark:bg-slate-800 ml-auto" />
                </div>
            ))}
        </div>
    );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {hasSearch ? "No staff match your search" : "No staff registered yet"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
                {hasSearch ? "Try a different name, email or city." : "Add a new Sahara staff member to get started."}
            </p>
        </div>
    );
}

/* ── Main component ── */

export function AgentList() {
    const queryClient = useQueryClient();
    const [selectedAgent, setSelectedAgent] = React.useState<CareAgent | null>(null);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const {
        data: agents = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["care-agents"],
        queryFn: getCareAgents,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCareAgent,

        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["care-agents"] });
            const previous = queryClient.getQueryData<CareAgent[]>(["care-agents"]);
            queryClient.setQueryData<CareAgent[]>(
                ["care-agents"],
                (old = []) => old.filter((a) => a.id !== id)
            );
            return { previous };
        },

        onError: (_err, _id, context) => {
            queryClient.setQueryData(["care-agents"], context?.previous);
            toast.error("Failed to delete staff. Please try again.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["care-agents"] });
        },

        onSuccess: () => {
            toast.success("Staff deleted successfully");
            setIsDeleteOpen(false);
        },
    });

    const filteredAgents = React.useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return agents;
        return agents.filter((a) =>
            (a.user.name ?? "").toLowerCase().includes(term) ||
            (a.user.email ?? "").toLowerCase().includes(term) ||
            (a.city ?? "").toLowerCase().includes(term)
        );
    }, [agents, search]);

    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelectedAgent(null);
    };

    const handleCloseProfile = () => {
        setIsProfileOpen(false);
        setSelectedAgent(null);
    };

    return (
        <>
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <SearchFilter
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name, email or city…"
                />
                {!isLoading && (
                    <p className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                        {filteredAgents.length} of {agents.length} staff
                    </p>
                )}
            </div>

            {/* ── Table card ── */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {isLoading ? (
                    <TableSkeleton />
                ) : isError ? (
                    <div className="flex items-center justify-center py-16">
                        <p className="text-sm text-red-500 font-medium">
                            Failed to load staff. Please try again.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                {["Staff", "Contact", "Status", "Location", "Experience", "Specialization", "Actions"].map((h) => (
                                    <TableHead
                                        key={h}
                                        className={cn(
                                            "text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3",
                                            h === "Actions" && "text-right"
                                        )}
                                    >
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredAgents.length === 0 ? (
                                <TableRow className="hover:bg-transparent">
                                    <TableCell colSpan={7} className="p-0">
                                        <EmptyState hasSearch={search.trim().length > 0} />
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAgents.map((agent) => (
                                    <TableRow
                                        key={agent.id}
                                        className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                                    >
                                        {/* ── Staff ── */}
                                        <TableCell className="py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                                                    avatarColor(agent.user.name)
                                                )}>
                                                    {getInitials(agent.user.name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                                        {agent.user.name}
                                                    </p>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                                        <Mail className="w-3 h-3 shrink-0" />
                                                        {agent.user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* ── Contact ── */}
                                        <TableCell className="py-3.5">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {agent.phone}
                                            </span>
                                        </TableCell>

                                        {/* ── Status ── */}
                                        <TableCell className="py-3.5">
                                            <StatusBadge status={agent.status} />
                                        </TableCell>

                                        {/* ── Location ── */}
                                        <TableCell className="py-3.5">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {[agent.tole, agent.city].filter(Boolean).join(", ")}
                                            </span>
                                        </TableCell>

                                        {/* ── Experience ── */}
                                        <TableCell className="py-3.5">
                                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                {agent.experience} yr{agent.experience !== 1 ? "s" : ""}
                                            </span>
                                        </TableCell>

                                        {/* ── Specialization ── */}
                                        <TableCell className="py-3.5 max-w-45">
                                            {agent.specialization ? (
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                    {agent.specialization}
                                                </p>
                                            ) : (
                                                <span className="text-xs text-slate-300 dark:text-slate-600">—</span>
                                            )}
                                        </TableCell>

                                        {/* ── Actions ── */}
                                        <TableCell className="py-3.5 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-80 group-hover:opacity-100 focus:opacity-100 transition-all outline-none">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-44 p-1 shadow-lg border-slate-200 dark:border-slate-700"
                                                >
                                                    <DropdownMenuItem className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedAgent(agent);
                                                            setIsProfileOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedAgent(agent);
                                                            setIsEditOpen(true);
                                                        }}
                                                    >
                                                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                                                    <DropdownMenuItem
                                                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600"
                                                        onClick={() => {
                                                            setSelectedAgent(agent);
                                                            setIsDeleteOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete Staff
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>

            <CareAgentProfileModal
                agentId={selectedAgent?.id ?? null}
                open={isProfileOpen}
                onOpenChange={(open) => {
                    if (!open) handleCloseProfile();
                }}
            />

            {/* ── Sheets & Dialogs ── */}
            <EditSaharaSheet
                agent={selectedAgent}
                isOpen={isEditOpen}
                onClose={handleCloseEdit}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Delete Sahara Staff"
                description="This will permanently remove"
                itemName={selectedAgent?.user.name ?? ""}
                loading={deleteMutation.isPending}
                onConfirm={() =>
                    deleteMutation.mutate(selectedAgent!.id)
                }
            />
        </>
    );
}