"use client";

import * as React from "react";
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Mail, Phone, Globe, Users,
    MoreHorizontal, Eye, Pencil, Trash2, CreditCard,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { getClients, deleteClient } from "@/features/clients/api/client.api";
import { Client, BillingType, PaymentStatus } from "@/features/clients/types/client.type";
import { DeleteConfirmDialog } from "@/components/shared/dialogs/delete-confirm-dialogue.component";
import { EditClientSheet } from "@/features/clients/components/edit-client-sheet";
import { SearchFilter } from "@/components/shared/filter/search-filter.component";
import { AddClientModal } from "@/features/clients/components/add-client-modal";
import { ClientProfileModal } from "@/features/clients/components/client-profile-modal";


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


function PaymentBadge({ status }: { status: PaymentStatus }) {
    const map: Record<PaymentStatus, { label: string; className: string }> = {
        PAID:      { label: "Paid",      className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
        PENDING:   { label: "Pending",   className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800" },
        OVERDUE:   { label: "Overdue",   className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
        CANCELLED: { label: "Cancelled", className: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
    };
    const { label, className } = map[status] ?? map.PENDING;
    return (
        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border", className)}>
            {label}
        </span>
    );
}

function BillingBadge({ type }: { type: BillingType }) {
    const map: Record<BillingType, string> = {
        MONTHLY:   "Monthly",
        QUARTERLY: "Quarterly",
        YEARLY:    "Yearly",
    };
    return (
        <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <CreditCard className="w-3 h-3" />
            {map[type]}
        </span>
    );
}


function TableSkeleton() {
    return (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3.5 animate-pulse">
                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-2.5 w-48 rounded bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
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
            <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {hasSearch ? "No clients match your search" : "No clients registered yet"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
            {hasSearch ? "Try a different name, email or country." : "Add a new client to get started."}
            </p>
        </div>
    );
}


export function ClientList() {
    const queryClient = useQueryClient();
    const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    const { data: clients = [], isLoading, isError } = useQuery({
        queryKey: ["clients"],
        queryFn:  getClients,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteClient,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["clients"] });
            const previous = queryClient.getQueryData<Client[]>(["clients"]);
            queryClient.setQueryData<Client[]>(
            ["clients"],
            (old = []) => old.filter((c) => c.id !== id)
        );
            return { previous };
        },
        onError: (_err, _id, context) => {
            queryClient.setQueryData(["clients"], context?.previous);
            toast.error("Failed to delete client. Please try again.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
        },
        onSuccess: () => {
            toast.success("Client deleted successfully");
            setIsDeleteOpen(false);
        },
    });

    const filteredClients = React.useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return clients;
        return clients.filter((c) =>
            (c.name    ?? "").toLowerCase().includes(term) ||
            (c.email   ?? "").toLowerCase().includes(term) ||
            (c.country ?? "").toLowerCase().includes(term)
        );
    }, [clients, search]);

    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelectedClient(null);
    };

    const handleCloseProfile = () => {
        setIsProfileOpen(false);
        setSelectedClient(null);
    };

    return (
        <>
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between gap-3 mb-4">
            <SearchFilter
                value={search}
                onChange={setSearch}
                placeholder="Search by name, email or country…"
            />
            <div className="flex items-center gap-3 flex-shrink-0">
                {!isLoading && (
                <p className="text-xs text-slate-400 whitespace-nowrap">
                    {filteredClients.length} of {clients.length} clients
                </p>
                )}

            </div>
            </div>

            {/* ── Table card ── */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {isLoading ? (
                <TableSkeleton />
            ) : isError ? (
                <div className="flex items-center justify-center py-16">
                <p className="text-sm text-red-500 font-medium">
                    Failed to load clients. Please try again.
                </p>
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    {["Client", "Contact", "Location", "Care Receivers", "Billing", "Payment", "Actions"].map((h) => (
                        <TableHead
                        key={h}
                        className={cn(
                            "text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 py-3",
                            h === "Actions" && "text-right",
                            h === "Care Receivers" && "text-center",
                        )}
                        >
                        {h}
                        </TableHead>
                    ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {filteredClients.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={7} className="p-0">
                        <EmptyState hasSearch={search.trim().length > 0} />
                        </TableCell>
                    </TableRow>
                    ) : (
                    filteredClients.map((client) => (
                        <TableRow
                        key={client.id}
                        className="group border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                        >
                        {/* ── Client ── */}
                        <TableCell className="py-3.5">
                            <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                                avatarColor(client.name)
                            )}>
                                {getInitials(client.name)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                {client.name}
                                </p>
                                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                {client.email}
                                </p>
                            </div>
                            </div>
                        </TableCell>

                        {/* ── Contact ── */}
                        <TableCell className="py-3.5">
                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {client.countryCode} {client.phone}
                            </span>
                        </TableCell>

                        {/* ── Location ── */}
                        <TableCell className="py-3.5">
                            <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                            {[client.city, client.country].filter(Boolean).join(", ")}
                            </span>
                        </TableCell>

                        {/* ── Care Receivers ── */}
                        <TableCell className="py-3.5 text-center">
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {client.careReceivers?.length ?? 0}
                            </span>
                        </TableCell>

                        {/* ── Billing ── */}
                        <TableCell className="py-3.5">
                            <BillingBadge type={client.billingType} />
                        </TableCell>

                        {/* ── Payment ── */}
                        <TableCell className="py-3.5">
                            <PaymentBadge status={client.paymentStatus} />
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
                                <DropdownMenuItem
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                onClick={() => {
                                    setSelectedClient(client);
                                    setIsProfileOpen(true);
                                }}
                                >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                onClick={() => {
                                    setSelectedClient(client);
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
                                    setSelectedClient(client);
                                    setIsDeleteOpen(true);
                                }}
                                >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete Client
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

            {/* ── Modals & Sheets ── */}
            <AddClientModal
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            />

            <EditClientSheet
            client={selectedClient}
            isOpen={isEditOpen}
            onClose={handleCloseEdit}
            />

            <DeleteConfirmDialog
            isOpen={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            title="Delete Client"
            description="This will permanently remove the client and all associated care receivers."
            itemName={selectedClient?.name ?? ""}
            loading={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate(selectedClient!.id)}
            />
            <ClientProfileModal
                clientId={selectedClient?.id ?? null}
                open={isProfileOpen}
                onOpenChange={(open) => {
                    if (!open) handleCloseProfile();
                }}
            />
        </>
    );
}