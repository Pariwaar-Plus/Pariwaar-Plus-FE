"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Eye,
  MoreHorizontal,
  Plus,
  Repeat
} from "lucide-react";
import * as React from "react";

import { SearchFilter } from "@/components/shared/filter/search-filter.component";
import { VisitChip } from "@/components/shared/visit-log/visit-card";
import {
  AssignmentStatus,
  CareAssignment,
  VisitFrequency,
} from "@/features/care-assignment/types/care-assignment.type";
import { CareReceiverProfileModal } from "@/features/care-receiver/components/care-receiver-profile-modal";
import { LogVisitModal } from "@/features/visit-log/components/log-visit-modal";
import { VisitDetailView } from "@/features/visit-log/components/single-visit-log-modal";
import { VisitHistoryModal } from "@/features/visit-log/components/visit-history-modal";

/* ─────────────────────────────────────────────
   Badges
───────────────────────────────────────────── */

const STATUS_MAP: Record<
  AssignmentStatus,
  { label: string; className: string }
> = {
  ACTIVE: {
    label: "Active",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  ON_HOLD: {
    label: "On Hold",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
  },
};

function StatusBadge({ status }: { status: AssignmentStatus }) {
  const { label, className } = STATUS_MAP[status] ?? STATUS_MAP.ACTIVE;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border",
        className,
      )}
    >
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
        <div
          key={i}
          className="flex items-center gap-4 px-4 py-3.5 animate-pulse"
        >
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
        {hasSearch
          ? "Try a different agent or receiver name."
          : "Assign a care agent from a care receiver's profile."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export function CareAgentAssignmentList({ assignments, isLoading, isError }: { assignments: CareAssignment[], isLoading: boolean, isError: any }) {
  const [search, setSearch] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const [selected, setSelected] = React.useState<CareAssignment | null>(null);

  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const [logOpen, setLogOpen] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [visitId, setVisitId] = React.useState<string | null>(null);


  const onClickDate = (id: string) => {
    setVisitId(id);
    setDetailsOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelected(null);
  };

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return assignments;
    return assignments.filter(
      (a) =>
        // a.careAgentName.toLowerCase().includes(term) ||
        // a.careReceiverName.toLowerCase().includes(term)
        a,
    );
  }, [assignments, search]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
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
            <div className="grid grid-cols-[1.6fr_1.6fr_0.9fr_0.9fr_0.9fr_40px] gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <div>Care Receiver</div>
              <div>Visit Frequency</div>
              <div>Status</div>
              <div>Next Visit</div>
            </div>

            {filtered.map((a) => {
              const isExpanded = expandedId === a.id;
              const agentInitials = a.careAgent?.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const receiverInitials = a.careReceiver?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const nextVisitLabel = a.schedule.nextVisit
                ? new Date(a.schedule.nextVisit).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
                : "—";

              return (
                <div
                  key={a.id}
                  className="border-t border-slate-100 dark:border-slate-800"
                >
                  {/* Row */}
                  <div
                    className="group grid grid-cols-[1.6fr_1.6fr_0.9fr_0.9fr_0.9fr_40px] gap-2 px-4 py-3.5 items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => toggleExpand(a.id)}
                  >
                    {/* Care Receiver */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {receiverInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                          {a.careReceiver?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {a.careReceiver?.city}
                        </p>
                      </div>
                    </div>

                    {/* Frequency */}
                    <div>
                      <FrequencyBadge frequency={a.schedule.frequency} />
                    </div>

                    {/* Status */}
                    <div>
                      <StatusBadge status={a.status} />
                    </div>

                    {/* Next visit */}
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {nextVisitLabel}
                    </div>

                    {/* Actions */}
                    {/* Actions */}
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-slate-400 transition-transform",
                          isExpanded && "rotate-180",
                        )}
                      />
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
                              setSelected(a);
                              setLogOpen(true);
                            }}
                          >
                            <Plus className="w-3.5 h-3.5 text-slate-400" />
                            Add Visit Log
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                            onClick={() => {
                              setSelected(a);
                              setHistoryOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View All Visit Logs
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                            onClick={() => {
                              setSelected(a);
                              setIsProfileOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View Care Reciever Info
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Expanded — recent visits strip */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-18 bg-slate-50/60 dark:bg-slate-800/30 border-t border-dashed border-slate-200 dark:border-slate-700">
                      {/* <div className="flex items-center gap-2 flex-wrap"> */}
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 pt-3 mb-2.5">
                        Recent Visits
                      </p>
                      <div className="flex gap-4">
                        {a.schedule.recentVisits.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">
                            No visits logged yet
                          </p>
                        ) : (
                          a.schedule.recentVisits.map((v, index) => (
                            <VisitChip
                              key={v.id}
                              visit={{
                                scheduledAt: v.scheduledAt,
                                status: v.status,
                              }}
                              onClickHandleVisitCard={() => onClickDate(v.id)}
                            />
                          ))
                        )}
                      </div>
                      {/* </div> */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Modals */}
      <LogVisitModal
        assignmentId={selected?.id ?? null}
        careReceiverId={selected?.careReceiverId ?? null}
        receiverName={selected?.careReceiver?.name}
        open={logOpen}
        onOpenChange={setLogOpen}
      />
      <VisitHistoryModal
        careReceiverId={selected?.careReceiverId ?? null}
        receiverName={selected?.careReceiver?.name}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />

      <CareReceiverProfileModal
        careReceiverId={selected?.careReceiverId ?? null}
        open={isProfileOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseProfile();
        }}
      />

      <VisitDetailView
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        visitId={visitId}
      />
    </>
  );
}
