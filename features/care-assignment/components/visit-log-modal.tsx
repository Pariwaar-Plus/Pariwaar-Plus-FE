"use client";

import { Check, X as XIcon, Clock, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CareAssignment, VisitStatus } from "../types/assignment.type";

/**
 * Placeholder visit log viewer.
 * Once VisitLog CRUD (api + types) is built, replace the static
 * `assignment.recentVisits` rendering below with a real
 * `useQuery(["visit-logs", assignment.id], () => getVisitLogs(assignment.id))`
 * call and render full clinical details (vitals, medications, notes) per entry.
 */

interface VisitLogModalProps {
  assignment: CareAssignment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STATUS_CONFIG: Record<VisitStatus, { icon: React.ElementType; className: string }> = {
  COMPLETED: { icon: Check, className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
  MISSED:    { icon: XIcon, className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
  SCHEDULED: { icon: Clock, className: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
  CANCELLED: { icon: XIcon, className: "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700" },
};

export function VisitLogModal({ assignment, open, onOpenChange }: VisitLogModalProps) {
  if (!assignment) return null;

  const visits = assignment.recentVisits ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Visit logs for {assignment.careAgentName} and {assignment.careReceiverName}</DialogTitle>
        </VisuallyHidden>

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Visit Logs
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {assignment.careAgentName} → {assignment.careReceiverName}
              </p>
            </div>
          </div>
        </div>

        {/* ── Visit list ── */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-2">
          {visits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <ClipboardList className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No visits logged yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Visits will appear here once scheduled or completed.
              </p>
            </div>
          ) : (
            visits.map((visit) => {
              const { icon: Icon, className } = STATUS_CONFIG[visit.status] ?? STATUS_CONFIG.SCHEDULED;
              const dateLabel = new Date(visit.scheduledAt).toLocaleDateString("en-US", {
                weekday: "short", month: "short", day: "numeric", year: "numeric",
              });

              return (
                <div
                  key={visit.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border", className)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {dateLabel}
                    </p>
                    <p className="text-xs text-slate-400 capitalize mt-0.5">
                      {visit.status.toLowerCase()}
                    </p>
                  </div>
                </div>
              );
            })
          )}

          <p className="text-xs text-slate-400 text-center pt-2">
            Full clinical details (vitals, medications, notes) will appear here
            once visit logging is connected.
          </p>
        </div>

      </DialogContent>
    </Dialog>
  );
}
