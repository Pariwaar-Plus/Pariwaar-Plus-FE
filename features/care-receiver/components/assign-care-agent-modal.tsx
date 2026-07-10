"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createCareAssignment, deleteCareAssignment, getCareAssignmentByCareReceiver } from "@/features/care-assignment/api/care-assignment.api";
import { getCareAgents } from "@/features/sahara-staff/api/care-agent.api";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { CareAssignmentFormValues } from "@/features/care-assignment/schemas/care-assignment.schema";

// ----------------------
// Types
// ----------------------

export type CareAgent = {
  id: string;
  name: string;
  email: string;
};



interface AssignCareAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  careReceiverId: string;
}

type VisitFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "ON_DEMAND";



// type AssignmentFormValues = {
//   careAgentId: string;
//   startDate: string;
//   endDate?: string;
//   notes?: string;
//   frequency: VisitFrequency
// };

export function ManageCareAgentsModal({
  isOpen,
  onClose,
  careReceiverId
}: AssignCareAgentModalProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [careAgentId, setCareAgentId] = useState("");

  const {
    data: careReceiverAssignments,
    isLoading: isLoadingExisting,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "care-assignments-for-care-receiver",
      careReceiverId,
    ],
    queryFn: () =>
      getCareAssignmentByCareReceiver(
        careReceiverId!
      ),

  });


  const { data: allAgents = [], isLoading } = useQuery({
    queryKey: ["care-agents"],
    queryFn: getCareAgents,
  });


  const form = useForm<CareAssignmentFormValues>({
    defaultValues: {
      careAgentId: "",
      frequency: "" as VisitFrequency,
      startDate: "",
      endDate: "",
      notes: "",
      careReceiverId
    },
  });

  const { register, handleSubmit, reset, watch } = form;



  // ----------------------
  // Mutations
  // ----------------------

  const mutation = useMutation({
    mutationFn: createCareAssignment,
    onSuccess: () => {
      toast.success("Assignment created");

      queryClient.invalidateQueries({
        queryKey: ["care-assignments-for-care-receiver", careReceiverId],
      });

      reset();
      // onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to create assignment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCareAssignment,

    onSuccess: () => {
      toast.success("Assignment removed");

      queryClient.invalidateQueries({
        queryKey: ["care-assignments-for-care-receiver", careReceiverId],
      });
    },

    onError: () => {
      toast.error("Failed to remove assignment");
    },
  });

  // ---------------- SUBMIT ----------------

  const onSubmit = (values: CareAssignmentFormValues) => {
    if (!values.careAgentId || !values.startDate || !values.frequency) {
      toast.error("Care agent, visit frequency and start date are required");
      return;
    }

    mutation.mutate(values);

  };

  const assignedIds = useMemo(
    () => new Set(careReceiverAssignments?.map((a) => a.careAgentId)),
    [careReceiverAssignments]
  );


  const availableAgents = useMemo(() => {
    return allAgents
      .filter((a) => !assignedIds.has(a.id))
      .filter((a) =>
        a.user.name.toLowerCase().includes(search.toLowerCase())
      );
  }, [allAgents, assignedIds, search]);

  const visitFrequency = {
    DAILY: "DAILY", WEEKLY: "WEEKLY", BIWEEKLY: "BIWEEKLY", MONTHLY: "MONTHLY", ON_DEMAND: "ON_DEMAND"
  }



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Manage Care Agents</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* ---------------- Assigned Agents ---------------- */}
          <div>
            <h3 className="font-semibold mb-3">
              Assigned Care Agents
            </h3>
            {isLoadingExisting && <p>Loading..</p>}

            {careReceiverAssignments?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No care agents assigned.
              </p>
            ) : (
              <div className="space-y-2">
                {careReceiverAssignments?.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div>
                      <p className="font-medium">{assignment.careAgent?.user.name}</p>
                      {/* <p className="text-xs text-muted-foreground">
                        {format(assignment.startDate, "yyyy/MM/dd")}-{assignment.endDate ? format(assignment.endDate, "yyyy/MM/dd") : ""}
                      </p> */}
                    </div>


                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(assignment.id)}
                      disabled={deleteMutation.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* ---------------- Add Agents ---------------- */}
          <div className="space-y-3">
            <h3 className="font-semibold">New Assignment</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Care Agent */}
              <select
                className="w-full border rounded p-2"
                {...register("careAgentId")}
              >
                <option value="">Select Care Agent</option>
                {availableAgents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.user.name}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                className="w-full border rounded p-2"
                {...register("frequency")}
              >
                <option value="">Select Visit Frequency</option>
                {Object.entries(visitFrequency).map(([key, value]) =>
                  <option value={value}>{key}</option>
                )}
              </select>

              {/* Start Date */}
              <Input type="date" {...register("startDate")} />

              {/* End Date */}
              <Input type="date" {...register("endDate")} />

              {/* Notes */}
              <Textarea
                placeholder="Notes..."
                {...register("notes")}
              />

              <Button type="submit" disabled={mutation.isPending}>
                Assign Care Agent
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}