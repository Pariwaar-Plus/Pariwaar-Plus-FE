import { VisitStatus } from "@/features/visit-log/types/visit-log.type";
import { cn } from "@/lib/utils";
import { Check, Clock, XIcon } from "lucide-react";

export function VisitChip({
    visit,
    onClickHandleVisitCard,
}: {
    visit: { scheduledAt: string; status: VisitStatus };
    onClickHandleVisitCard(): void;
}) {
    const date = new Date(visit.scheduledAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const config: Record<
        VisitStatus,
        { icon: React.ElementType; className: string; label?: string }
    > = {
        COMPLETED: {
            icon: Check,
            className:
                "border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 bg-green-200",
        },
        MISSED: {
            icon: XIcon,
            className:
                "border-slate-200 dark:border-slate-700 text-red-500 dark:text-red-400 bg-red-200",
            label: "missed",
        },
        SCHEDULED: {
            icon: Clock,
            className:
                "border-dashed border-slate-300 dark:border-slate-600 text-slate-400 dark:text-slate-500",
            label: "scheduled",
        },
        CANCELLED: {
            icon: XIcon,
            className: "border-slate-200 dark:border-slate-700 text-slate-400 bg-red-200",
            label: "cancelled",
        },
    };

    const {
        icon: Icon,
        className,
        label,
    } = config[visit.status] ?? config.SCHEDULED;

    return (
        <button
            onClick={onClickHandleVisitCard}
            className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border  dark:bg-slate-900 text-xs cursor-pointer",
                className,
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
                {date}
            </span>
            {label && (
                <span className="text-slate-400 dark:text-slate-500">{label}</span>
            )}
        </button>
    );
}
