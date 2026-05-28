"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export function SearchFilter({
    value,
    onChange,
    placeholder = "Search...",
    label,
    className,
}: SearchFilterProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>

            {/* ── Search input ── */}
            <div className="relative max-w-sm flex-1 group">
                {/* Icon */}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none z-10" />

                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={cn(
                        "w-full h-9 pl-9 pr-8 rounded-lg text-sm",
                        "bg-white dark:bg-slate-800/60",
                        "border border-slate-200 dark:border-slate-700",
                        "text-slate-800 dark:text-slate-100",
                        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                        "outline-none transition-all duration-150",
                        "focus:border-emerald-400 dark:focus:border-emerald-500",
                        "focus:ring-2 focus:ring-emerald-400/20 dark:focus:ring-emerald-500/20",
                        "hover:border-slate-300 dark:hover:border-slate-600",
                    )}
                />

                {/* Clear button */}
                {value && (
                    <button
                        onClick={() => onChange("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                        aria-label="Clear search"
                        type="button"
                    >
                        <X className="w-2.5 h-2.5 text-slate-500 dark:text-slate-300" />
                    </button>
                )}
            </div>

            {/* ── Optional label / result count ── */}
            {label && (
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    {label}
                </p>
            )}
        </div>
    );
}