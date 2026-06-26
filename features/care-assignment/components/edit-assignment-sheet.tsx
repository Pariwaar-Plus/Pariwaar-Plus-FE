"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Repeat, Calendar, FileText,
  Loader2, Save, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import {
  Form, FormField, FormItem,
  FormLabel, FormControl, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { updateAssignment } from "../api/assignment.api";
import { CareAssignment } from "../types/assignment.type";
import {
  updateAssignmentSchema,
  UpdateAssignmentFormValues,
} from "../schemas/assignment.schema";

/* ── Shared styles ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 mt-6 first:mt-0">
      {children}
    </p>
  );
}

function FieldWithIcon({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
      <div className="[&_input]:pl-9">{children}</div>
    </div>
  );
}

const inputClass = cn(
  "h-9 rounded-lg border border-slate-200 dark:border-slate-700",
  "bg-white dark:bg-slate-800/60",
  "text-sm text-slate-800 dark:text-slate-100",
  "placeholder:text-slate-400",
  "focus-visible:ring-2 focus-visible:ring-emerald-400/30 focus-visible:border-emerald-400",
  "transition-all duration-150"
);

const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

interface EditAssignmentSheetProps {
  assignment: CareAssignment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditAssignmentSheet({ assignment, isOpen, onClose }: EditAssignmentSheetProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateAssignmentFormValues>({
    resolver: zodResolver(updateAssignmentSchema) as any,
    defaultValues: {
      visitFrequency: "WEEKLY",
      startDate:      "",
      endDate:        "",
      status:         "ACTIVE",
      notes:          "",
    },
  });

  React.useEffect(() => {
    if (!assignment) return;
    form.reset({
      visitFrequency: assignment.visitFrequency,
      startDate:      assignment.startDate ? assignment.startDate.split("T")[0] : "",
      endDate:        assignment.endDate   ? assignment.endDate.split("T")[0]   : "",
      status:         assignment.status,
      notes:          assignment.notes ?? "",
    });
  }, [assignment, form]);

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAssignmentFormValues }) =>
      updateAssignment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast.success("Assignment updated successfully");
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update assignment");
    },
  });

  const onSubmit = (values: UpdateAssignmentFormValues) => {
    if (!assignment) return;
    mutation.mutate({ id: assignment.id, data: values });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[460px] p-0 flex flex-col gap-0 overflow-hidden">

        {/* ── Header ── */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center flex-shrink-0">
              <Repeat className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <SheetTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                Edit Assignment
              </SheetTitle>
              <SheetDescription className="text-xs text-slate-400 mt-0.5 truncate">
                {assignment?.careAgentName ?? "Loading…"} → {assignment?.careReceiverName ?? ""}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* ── Form body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Form {...form}>
            <form
              id="edit-assignment-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              <SectionLabel>Schedule</SectionLabel>

              <FormField
                control={form.control}
                name="visitFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Visit Frequency</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="BIWEEKLY">Biweekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="ON_DEMAND">On demand</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>Start Date</FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Calendar}>
                          <Input {...field} type="date" className={inputClass} />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelClass}>
                        End Date{" "}
                        <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <FieldWithIcon icon={Calendar}>
                          <Input {...field} type="date" className={inputClass} />
                        </FieldWithIcon>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <SectionLabel>Status</SectionLabel>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>Assignment Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputClass}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="ON_HOLD">On Hold</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <SectionLabel>Notes</SectionLabel>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelClass}>
                      Notes{" "}
                      <span className="text-slate-300 dark:text-slate-600 font-normal">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className={cn(inputClass, "h-20 resize-none pt-2")}
                        placeholder="Any special instructions for this assignment…"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

            </form>
          </Form>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          {form.formState.isDirty && (
            <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
              Unsaved changes
            </p>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
            <button
              type="submit"
              form="edit-assignment-form"
              disabled={mutation.isPending || !form.formState.isDirty}
              className={cn(
                "inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-semibold",
                "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
                "shadow-sm hover:shadow-md hover:shadow-emerald-500/20",
                "hover:-translate-y-px active:translate-y-0 transition-all duration-150",
                "disabled:opacity-55 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
              )}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

      </SheetContent>
    </Sheet>
  );
}
