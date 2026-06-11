// components/shared/dialogs/delete-confirm-dialogue.component.tsx
"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Props ────────────────────────────────────────────────────────────────────

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    itemName: string;
    loading?: boolean;
    onConfirm: () => void | Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DeleteConfirmDialog({
    isOpen,
    onOpenChange,
    title = "Delete Item",
    description = "This will permanently remove",
    itemName,
    loading = false,
    onConfirm,
}: DeleteConfirmDialogProps) {
    const handleDelete = async () => {
        if (loading) return;
        await onConfirm();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={loading ? undefined : onOpenChange}>
            <AlertDialogContent className="p-0 gap-0 overflow-hidden max-w-md">

                {/* ── Warning stripe ── */}
                <div className="h-1.5 w-full bg-linear-to-r from-red-500 to-rose-500" />

                {/* ── Header ── */}
                <AlertDialogHeader className="px-6 pt-6 pb-5">
                    <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 flex items-center justify-center shrink-0">
                            <TriangleAlert className="w-5 h-5 text-red-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <AlertDialogTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                {title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {description}{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    &quot;{itemName}&quot;
                                </span>{" "}
                                from the system. This action cannot be undone.
                            </AlertDialogDescription>
                        </div>
                    </div>

                    {/* Warning note */}
                    <div className="mt-4 flex items-center gap-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-lg px-3.5 py-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />
                        <p className="text-xs font-medium text-red-600 dark:text-red-400">
                            All associated data will be permanently erased.
                        </p>
                    </div>
                </AlertDialogHeader>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end gap-2">
                    <AlertDialogCancel
                        disabled={loading}
                        className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                    </AlertDialogCancel>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                        className={cn(
                            "inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-semibold",
                            "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
                            "shadow-sm hover:shadow-md hover:shadow-red-500/25",
                            "hover:-translate-y-px active:translate-y-0 transition-all duration-150",
                            "disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                            </>
                        )}
                    </button>
                </div>

            </AlertDialogContent>
        </AlertDialog>
    );
}