"use client";

import * as React from "react";
import { format } from "date-fns";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    Eye,
    MapPin,
    MoreHorizontal,
    Pencil,
    Trash2,
    User
} from "lucide-react";

import { toast } from "sonner";

/* API */
import {
    deleteCareReceiver,
    getCareReceivers,
} from "../api/care-receiver.api";

/* Types */
import { CareReceiver } from "../types/care-receiver.type";

/* UI Components */
import { DeleteConfirmDialog } from "@/components/shared/dialogs/delete-confirm-dialogue.component";
import { SearchFilter } from "@/components/shared/filter/search-filter.component";
import { EditCareReceiverSheet } from "../components/edit-care-receiver-sheet";
import { CareReceiverProfileModal } from "./care-receiver-profile-modal";

export function CareReceiverList() {
    const queryClient = useQueryClient();

    const [selectedReceiver, setSelectedReceiver] =
        React.useState<CareReceiver | null>(null);

    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    /* ---------------- FETCH ---------------- */
    const {
        data: receivers = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["care-receivers"],
        queryFn: getCareReceivers,
    });

    /* ---------------- DELETE ---------------- */
    const deleteMutation = useMutation({
        mutationFn: deleteCareReceiver,

        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ["care-receivers"] });

            const previous = queryClient.getQueryData<CareReceiver[]>([
                "care-receivers",
            ]);

            queryClient.setQueryData<CareReceiver[]>(
                ["care-receivers"],
                (old = []) => old.filter((r) => r.id !== id)
            );

            return { previous };
        },

        onError: (_err, _id, context) => {
            queryClient.setQueryData(["care-receivers"], context?.previous);
            toast.error("Delete failed");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["care-receivers"] });
        },

        onSuccess: () => {
            toast.success("Care receiver deleted successfully");
            handleCloseDelete();
        },
    });

    /* ---------------- SEARCH ---------------- */

    const filteredReceivers = React.useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return receivers;

        return receivers.filter((r) =>
            `${r.name} ${r.city} ${r.phone}`
                .toLowerCase()
                .includes(term)
        );
    }, [receivers, search]);

    /* ---------------- HANDLERS ---------------- */
    const handleCloseEdit = () => {
        setIsEditOpen(false);
        setSelectedReceiver(null);
    };

    const handleCloseDelete = () => {
        setIsDeleteOpen(false);
        setSelectedReceiver(null);
    };

     const handleCloseProfile = () => {
        setIsProfileOpen(false);
        setSelectedReceiver(null);
    };

    /* ---------------- STATES ---------------- */
    if (isLoading) {
        return (
            <div className="p-6 text-muted-foreground">
                Loading care receivers...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-red-500">
                Failed to load care receivers
            </div>
        );
    }

    return (
        <>
            {/* SEARCH */}
            <SearchFilter
                value={search}
                onChange={setSearch}
                placeholder="Search Care Receiver..."
                label="Filter by name, city, or contact"
            />

            <div className="bg-white dark:bg-slate-950 rounded-xl border shadow-sm overflow-hidden">

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Receiver Name</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>DOB</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Medical</TableHead>
                            {/* <TableHead>Status</TableHead> */}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredReceivers.map((r) => (
                            <TableRow key={r.id}>

                                {/* NAME */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-xs uppercase tracking-wider flex items-center gap-2">
                                            <User className="h-3 w-3" />
                                            {r.name}
                                        </span>

                                        <span className="text-xs text-muted-foreground mt-1">
                                            {r.phone}
                                        </span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-sm items-center gap-2">
                                    {r.gender}
                                </TableCell>

                                {/* DOB */}
                                <TableCell className="text-sm items-center gap-2">
                                    {format(r.dateOfBirth, "yyyy-MM-dd")}
                                </TableCell>
                                <TableCell className="flex  ">
                                    <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                                    {r.city ?? "-"}
                                </TableCell>

                                {/* MEDICAL */}
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {(r.medicalCondition?.split(",") ?? []).map((m) => (
                                            <Badge key={m} variant="secondary">
                                                {m}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>

                                {/* STATUS */}
                                {/* <TableCell>
                                    <Badge
                                        className={cn(
                                            r.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        )}
                                    >
                                        {r.status}
                                    </Badge>
                                </TableCell> */}

                                {/* ACTIONS */}
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
                                                    setSelectedReceiver(r);
                                                    setIsProfileOpen(true);
                                                }}
                                            >
                                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                                View Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedReceiver(r);
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
                                                    setSelectedReceiver(r);
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
                        ))}

                        {filteredReceivers.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center h-24 text-muted-foreground"
                                >
                                    No care receivers found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* EDIT */}
            <EditCareReceiverSheet
                receiver={selectedReceiver}
                isOpen={isEditOpen}
                onClose={handleCloseEdit}
            />

            {/* DELETE */}
            <DeleteConfirmDialog
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Delete Care Receiver"
                description="This action will permanently remove."
                itemName={selectedReceiver?.name ?? ""}
                loading={deleteMutation.isPending}
                onConfirm={() =>
                    deleteMutation.mutate(selectedReceiver!.id, {
                        onSuccess: () => handleCloseDelete(),
                    })
                }
            />

            <CareReceiverProfileModal
                careReceiverId={selectedReceiver?.id ?? null}
                open={isProfileOpen}
                onOpenChange={(open) => {
                    if (!open) handleCloseProfile();
                }}
            />
        </>
    );
}