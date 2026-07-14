"use client";

import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { format } from "date-fns";
import { toast } from "sonner";
import { VisitLog, VisitStatus } from "../types/visit-log.type";
import { deleteVisitLog, getVisitHistory, getVisitLogs } from "../api/visit-log.api";
import { VisitDetailView } from "./single-visit-log-modal";
import { EditAssignmentSheet } from "@/features/care-assignment/components/edit-assignment-sheet";
import { Button } from "@/components/ui/button";
import VisitLogFilters from "./VisitLogFilters";
import { getCareAgents } from "@/features/sahara-staff/api/care-agent.api";
import { getCareReceivers } from "@/features/care-receiver/api/care-receiver.api";
import { useSearchParams } from "next/navigation";
import { EditVistLogSheet } from "./edit-visit-log-sheet";
import { DeleteConfirmDialog } from "@/components/shared/dialogs/delete-confirm-dialogue.component";
// import { VisitLogModal } from "./visit-log-modal";

/* ─────────────────────────────────────────────
   Badges
───────────────────────────────────────────── */

const STATUS_MAP: Record<VisitStatus, { label: string; className: string }> = {
  SCHEDULED: {
    label: "Scheduled",
    className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800"
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
  },
  MISSED: {
    label: "Missed",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-50/50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50"
  },
};



function StatusBadge({ status }: { status: VisitStatus }) {
  const { label, className } = STATUS_MAP[status] ?? STATUS_MAP.COMPLETED;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border", className)}>
      {label}
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
        {hasSearch ? "No logs match your search" : "No logs yet"}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {hasSearch ? "Try a different agent or receiver." : "No logs."}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export function VisitLogsList() {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();


  const careAgentId = searchParams.get("careAgentId") ?? "";
  const careReceiverId = searchParams.get("careReceiverId") ?? "";

  const [search, setSearch] = React.useState("");

  const [selected, setSelected] = React.useState<VisitLog | null>(null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [visitId, setVisitId] = React.useState<string | null>(null);

  const [filters, setFilters] = React.useState({
    careAgentId,
    careReceiverId,
    status: "",
    from: "",
    to: "",
  });
  const [tempFilters, setTempFilters] = React.useState(filters);
  const [openFilters, setOpenFilters] = React.useState(false);

  const handleCloseEdit = () => {
    setIsEditOpen(false);
    setSelected(null);
  };

  const {
    mutate: deleteVisitLogMutation,
    isPending: isDeleting
  } = useMutation({
    mutationFn: deleteVisitLog,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["visitlogs"],
      });

      toast.success(
        "Visit log deleted successfully"
      );
      setIsDeleteOpen(false)
      setSelected(null);
    },
    onError: (error) => {
      toast.error(
        error.message
      );
    }
  });



  const { data: visitLogs = [], isLoading, isError } = useQuery({
    queryKey: ["visitlogs", filters],
    queryFn: () =>
      getVisitLogs({
        page: 1,
        limit: 10,
        ...filters
      }),
  });


  const {
    data: careAgents = []
  } = useQuery({
    queryKey: ["care-agents"],
    queryFn: getCareAgents,
    enabled: openFilters
  });


  const {
    data: careReceivers = []
  } = useQuery({
    queryKey: ["care-receivers"],
    queryFn: getCareReceivers,
    enabled: openFilters
  });



  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return visitLogs;
    return visitLogs.filter((a) =>
      a.careAgent?.user.name.toLowerCase().includes(term) ||
      a.assignment?.careReceiver?.name.toLowerCase().includes(term)
    );
  }, [visitLogs, search]);

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">

          <SearchFilter
            value={search}
            onChange={setSearch}
            placeholder="Search by agent or receiver name…"
            className="max-w-md"
          />
          <Button
            variant="outline"
            onClick={() => setOpenFilters(true)}
          >
            Filters
          </Button>
        </div>
        {!isLoading && (
          <p className="text-xs text-slate-400 whitespace-nowrap shrink-0">
            {filtered.length} of {visitLogs.length} assignments
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
              Failed to load visit logs. Please try again.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={search.trim().length > 0 || filters.careReceiverId != ""} />
        ) : (
          <div>
            {/* Header row */}
            <div className="grid grid-cols-[1fr_2fr_2fr_1.6fr_40px] gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <div>Visit Date</div>
              <div>Care Agent</div>
              <div>Care Receiver</div>
              <div>Status</div>
            </div>

            {filtered.map((a) => {
              const agentInitials = a.careAgent?.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const receiverInitials = a.assignment?.careReceiver?.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();


              return (
                <div key={a.id} className="border-t border-slate-100 dark:border-slate-800">
                  {/* Row */}
                  <div
                    className="group grid grid-cols-[1fr_2fr_2fr_1.6fr_40px] gap-2 px-4 py-3.5 items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >

                    {/* Schedule Date */}
                    <div className="flex items-center gap-3 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                        {format(a.scheduledAt, 'd MMM yyyy')}
                      </p>
                    </div>


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
                          {a.assignment?.careReceiver?.name}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div><StatusBadge status={a.status} /></div>



                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>

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
                              setVisitId(a.id);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            View Log Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-slate-700 dark:text-slate-300 cursor-pointer"
                            onClick={() => {
                              setSelected(a);
                              setIsEditOpen(true);
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-400" />
                            Edit Log
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                          <DropdownMenuItem
                            disabled={a.status === "CANCELLED"}
                            className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            onClick={() => {
                              setSelected(a);
                              setIsDeleteOpen(true);
                            }}
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Delete Log
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
      <EditVistLogSheet
        visitLog={selected}
        isOpen={isEditOpen}
        onClose={handleCloseEdit}
      />

      {/* ── Visit log modal (placeholder until VisitLog CRUD is ready) ── */}
      {/* <VisitHistoryModal
        careReceiverId={selected?.careReceiverId ?? null}
        careAgentName = {selected?.careAgent?.user.name}
        receiverName={selected?.careReceiver?.name}
        open={isVisitLogOpen}
        onOpenChange={setIsVisitLogOpen}
      /> */}

      <VisitDetailView
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        visitId={visitId}
      />

      <VisitLogFilters
        open={openFilters}
        onClose={() =>
          setOpenFilters(false)
        }
        filters={tempFilters}
        setFilters={setTempFilters}
        onApply={() =>
          setFilters(tempFilters)
        }
        onReset={() => {
          const empty = {
            careAgentId: "",
            careReceiverId: "",
            status: "",
            from: "",
            to: ""
          };
          setOpenFilters(false)
          setTempFilters(empty);
          setFilters(empty);

        }}
        careReceivers={careReceivers}
        careAgents={careAgents}
      />

      {/* ── Cancel confirm ── */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete Log"
        description="This will mark the log as deleted"
        itemName={selected ? `${selected.careAgent?.user.name} → ${selected.assignment?.careReceiver?.name}` : ""}
        loading={isDeleting}
        onConfirm={() => deleteVisitLogMutation(selected!.id)}
      />
    </>
  );
}
