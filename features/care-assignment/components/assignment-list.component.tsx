"use client";

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  Calendar,
  ClipboardList,
  Eye,
  MoreHorizontal,
  Pencil,
  Repeat
} from "lucide-react";
import * as React from "react";


import { SearchFilter } from "@/components/shared/filter/search-filter.component";
import { VisitHistoryModal } from "@/features/visit-log/components/visit-history-modal";
import { getMyAssignments } from "../api/care-assignment.api";
import { AssignmentStatus, CareAssignment, VisitFrequency } from "../types/care-assignment.type";
import { EditAssignmentSheet } from "./edit-assignment-sheet";
import { format } from "date-fns";
// import { VisitLogModal } from "./visit-log-modal";

/* ─────────────────────────────────────────────
   Badges
───────────────────────────────────────────── */

const STATUS_MAP: Record<AssignmentStatus, { label: string; className: string }> = {
  ACTIVE: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800" },
  ON_HOLD: { label: "On Hold", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800" },
  COMPLETED: { label: "Completed", className: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800" },
};

function StatusBadge({ status }: { status: AssignmentStatus }) {
  const { label, className } = STATUS_MAP[status] ?? STATUS_MAP.ACTIVE;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border", className)}>
      {label}
    </span>
  );
}

const FREQUENCY_LABEL: Record<VisitFrequency, string> = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  BIWEEKLY: "Biweekly",
  MONTHLY: "Monthly",
  ON_DEMAND: "On demand",
};

function FrequencyBadge({ frequency }: { frequency: VisitFrequency }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      <Repeat className="w-3 h-3" />
      {FREQUENCY_LABEL[frequency]}
    </span>
  );
}


/* ─────────────────────────────────────────────
   Skeleton / Empty
───────────────────────────────────────────── */

function ListSkeleton() {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5 animate-pulse">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-2.5 w-48 rounded bg-slate-100 dark:bg-slate-800" />
          </div>
          <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-16 rounded bg-slate-100 dark:bg-slate-800" />
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
        <ClipboardList className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {hasSearch ? "No assignments match your search" : "No assignments yet"}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {hasSearch ? "Try a different agent or receiver name." : "Assign a care agent from a care receiver's profile."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export function AssignmentList() {

  const [search, setSearch] = React.useState("");

  const [selected, setSelected] = React.useState<CareAssignment | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isCancelOpen, setIsCancelOpen] = React.useState(false);
  const [isVisitLogOpen, setIsVisitLogOpen] = React.useState(false);

  const { data: assignments = [], isLoading, isError } = useQuery({
    queryKey: ["care-assignments"],
    queryFn: getMyAssignments,
  });

  // const cancelMutation = useMutation({
  //   mutationFn: cancelAssignment,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["assignments"] });
  //     toast.success("Assignment cancelled");
  //     setIsCancelOpen(false);
  //   },
  //   onError: (error: Error) => {
  //     toast.error(error.message || "Failed to cancel assignment");
  //   },
  // });

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assignments;
    return assignments.filter((a) =>
      // a.careAgentName.toLowerCase().includes(term) ||
      // a.careReceiverName.toLowerCase().includes(term)
      a
    );
  }, [assignments, search]);



  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelected(null);
  };

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <SearchFilter
          value={search}
          onChange={setSearch}
          placeholder="Search by agent or receiver name…"
          className="max-w-md"
        />
        {!isLoading && (
          <p className="text-xs text-slate-400 whitespace-nowrap shrink-0">
            {filtered.length} of {assignments.length} assignments
          </p>
        )}
      </div>

      {/* ── List card ── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-500 font-medium">
              Failed to load assignments. Please try again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={search.trim().length > 0} />
        ) : (
          <div>
            {/* Header row */}
            <div className="grid grid-cols-[1.6fr_1.6fr_1.6fr_0.9fr_0.9fr_0.9fr_40px] gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <div>Care Agent</div>
              <div>Care Receiver</div>
              <div>Period</div>
              <div>Frequency</div>
              <div>Status</div>
              <div>Next Visit</div>
            </div>

            {filtered.map((a) => {
              const agentInitials = a.careAgent?.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const receiverInitials = a.careReceiver?.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const nextVisitLabel = a.schedule.nextVisit
                ? new Date(a.schedule.nextVisit).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "—";

              return (
                <div key={a.id} className="border-t border-slate-100 dark:border-slate-800">
                  {/* Row */}
                  <div
                    className="group grid grid-cols-[1.6fr_1.6fr_1.6fr_0.9fr_0.9fr_0.9fr_40px] gap-2 px-4 py-3.5 items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    {/* Care Agent */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {agentInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {a.careAgent?.user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{a.careAgent?.employeeId}</p>
                      </div>
                    </div>

                    {/* Care Receiver */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {receiverInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {a.careReceiver?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{a.careReceiver?.city}</p>
                      </div>
                    </div>

                    {/* Period */}
                    <div className="flex items-center gap-3 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {format(a.schedule.startDate, 'd MMM yyyy')}{a.schedule.endDate ? ` - ${format(a.schedule.endDate, "d MMM yyyy")}` : "-"}
                      </p>
                    </div>

                    {/* Frequency */}
                    <div><FrequencyBadge frequency={a.schedule.frequency} /></div>

                    {/* Status */}
                    <div><StatusBadge status={a.status} /></div>

                    {/* Next visit */}
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {nextVisitLabel}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      {/* <ChevronDown className={cn(
                        "w-4 h-4 text-slate-400 transition-transform",
                        isExpanded && "rotate-180"
                      )} /> */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-80 group-hover:opacity-100 focus:opacity-100 transition-all outline-none">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 p-1 shadow-lg border-slate-200 dark:border-slate-700">
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                            onClick={() => {
                              setSelected(a);
                              setIsVisitLogOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View All Visit Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                            onClick={() => {
                              setSelected(a);
                              setIsEditOpen(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-400" />
                            Edit Assignment
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                          <DropdownMenuItem
                            disabled={a.status === "CANCELLED"}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => {
                              setSelected(a);
                              setIsCancelOpen(true);
                            }}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Cancel Assignment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>


                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Edit sheet ── */}
      <EditAssignmentSheet
        assignment={selected}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
      />

      {/* ── Visit log modal (placeholder until VisitLog CRUD is ready) ── */}
      <VisitHistoryModal
        careReceiverId={selected?.careReceiverId ?? null}
        receiverName={selected?.careReceiver?.name}
        open={isVisitLogOpen}
        onOpenChange={setIsVisitLogOpen}
      />

      {/* <VisitDetailView
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        visitId={visitId}
      /> */}

      {/* ── Cancel confirm ── */}
      {/* <DeleteConfirmDialog
        isOpen={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        title="Cancel Assignment"
        description="This will mark the assignment as cancelled. Future scheduled visits will not be generated."
        // itemName={selected ? `${selected.careAgentName} → ${selected.careReceiverName}` : ""}
        // loading={cancelMutation.isPending}
        // onConfirm={() => cancelMutation.mutate(selected!.id)}
      /> */}
    </>
  );
}
