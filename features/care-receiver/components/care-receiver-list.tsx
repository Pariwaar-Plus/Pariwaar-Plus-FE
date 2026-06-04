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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    MapPin,
    MoreHorizontal,
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

export function CareReceiverList() {
    const queryClient = useQueryClient();

    const [selectedReceiver, setSelectedReceiver] =
        React.useState<CareReceiver | null>(null);

    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

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
                                    {r.dateOfBirth}
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
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                View Profile
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setSelectedReceiver(r);
                                                    setIsEditOpen(true);
                                                }}
                                            >
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="text-red-600 font-medium"
                                                onClick={() => {
                                                    setSelectedReceiver(r);
                                                    setIsDeleteOpen(true);
                                                }}
                                            >
                                                Delete
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
        </>
    );
}