"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddActionButtonProps {
    label: string;
    onClick: () => void;
    loading?: boolean;
    className?: string;
}

export function AddActionButton({
    label,
    onClick,
    loading = false,
    className,
}: AddActionButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            type="button"
            className={cn(
                // Base
                "relative inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-semibold",
                "select-none outline-none transition-all duration-150",
                // Colors — emerald to match system brand
                "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800",
                "text-white",
                // Shadow & glow
                "shadow-sm hover:shadow-md hover:shadow-emerald-500/20",
                // Focus ring
                "focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
                // Disabled
                "disabled:opacity-55 disabled:cursor-not-allowed disabled:shadow-none",
                // Lift on hover
                "hover:-translate-y-px active:translate-y-0",
                className
            )}
            aria-busy={loading}
        >
            {/* Icon — spins while loading */}
            <span className={cn(
                "flex items-center justify-center w-4 h-4 transition-transform",
                loading && "animate-spin"
            )}>
                {loading ? (
                    // Spinner ring
                    <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                        <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        <path d="M8 2a6 6 0 0 1 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                ) : (
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                )}
            </span>

            <span>{loading ? "Processing…" : label}</span>
        </button>
    );
}