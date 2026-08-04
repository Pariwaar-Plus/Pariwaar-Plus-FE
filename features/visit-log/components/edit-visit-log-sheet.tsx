"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Calendar,
    Clock,
    Loader2,
    Repeat,
    Save, X
} from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
    Form,
    FormControl,
    FormField, FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Sheet, SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { UpdateVisitLogFormValues, updateVisitLogSchema } from "../schemas/visit-log.schema";
import { VisitLog } from "../types/visit-log.type";
import { updateVisitLog } from "../api/visit-log.api";
import { toIso } from "./log-visit-modal";


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

interface EditVisitLogSheetProps {
    visitLog: VisitLog | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditVistLogSheet({ visitLog, isOpen, onClose }: EditVisitLogSheetProps) {
    const queryClient = useQueryClient();

    const form = useForm<UpdateVisitLogFormValues>({
        resolver: zodResolver(updateVisitLogSchema) as any,
        defaultValues: {
            assignmentId: "",
            scheduledAt: new Date().toISOString().substring(0, 16), // Pre-fills current HTML datetime-local format
            checkInAt: "",
            checkOutAt: "",
            status: "SCHEDULED",
            cancellationReason: "",

            // Vitals (Set to undefined so fields start empty without throwing NaN)
            bloodPressureSystolic: undefined,
            bloodPressureDiastolic: undefined,
            pulseRate: undefined,
            temperature: undefined,
            oxygenSaturation: undefined,
            weight: undefined,
            bloodSugar: undefined,
            respiratoryRate: undefined,

            // Pain & wellbeing
            painLevel: undefined,
            mood: undefined,

            // Medications
            medicationsGiven: "",
            medicationsSkipped: "",

            // Clinical
            symptoms: "",
            woundCare: "",
            woundCondition: undefined,

            // Mobility
            mobilityAssessment: undefined,
            mobilityNotes: "",

            // Notes
            agentNotes: "",
        },
    });


    React.useEffect(() => {
        if (!visitLog) return;

        form.reset({
            assignmentId: visitLog.assignmentId ?? "",

            scheduledAt: visitLog.scheduledAt
                ? new Date(visitLog.scheduledAt)
                    .toISOString()
                    .substring(0, 16)
                : "",


            checkInAt: visitLog.checkInAt
                ? new Date(visitLog.checkInAt)
                    .toISOString()
                    .substring(0, 16)
                : "",

            checkOutAt: visitLog.checkOutAt
                ? new Date(visitLog.checkOutAt)
                    .toISOString()
                    .substring(0, 16)
                : "",

            status: visitLog.status ?? "SCHEDULED",

            cancellationReason:
                visitLog.cancellationReason ?? "",


            // Vitals
            bloodPressureSystolic:
                visitLog.bloodPressureSystolic ?? undefined,

            bloodPressureDiastolic:
                visitLog.bloodPressureDiastolic ?? undefined,

            pulseRate:
                visitLog.pulseRate ?? undefined,

            temperature:
                visitLog.temperature ?? undefined,

            oxygenSaturation:
                visitLog.oxygenSaturation ?? undefined,

            weight:
                visitLog.weight ?? undefined,

            bloodSugar:
                visitLog.bloodSugar ?? undefined,

            respiratoryRate:
                visitLog.respiratoryRate ?? undefined,


            // Pain & wellbeing
            painLevel:
                visitLog.painLevel ?? undefined,

            mood:
                visitLog.mood ?? undefined,


            // Medications
            medicationsGiven:
                visitLog.medicationsGiven ?? "",

            medicationsSkipped:
                visitLog.medicationsSkipped ?? "",


            // Clinical
            symptoms:
                visitLog.symptoms ?? "",

            woundCare:
                visitLog.woundCare ?? "",

            woundCondition:
                visitLog.woundCondition ?? undefined,


            // Mobility
            mobilityAssessment:
                visitLog.mobilityAssessment ?? undefined,

            mobilityNotes:
                visitLog.mobilityNotes ?? "",


            // Notes
            agentNotes:
                visitLog.agentNotes ?? "",
        });

    }, [visitLog, form]);

    const mutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateVisitLogFormValues }) =>
            updateVisitLog(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["visitlogs"] });
            queryClient.invalidateQueries({ queryKey: ["single-visit"] });
            toast.success("Visit Log updated successfully");
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update visit log");
        },
    });

    const onSubmit = (values: UpdateVisitLogFormValues) => {
        const payload = {
            ...values,

            scheduledAt: new Date(
                values.scheduledAt!
            ).toISOString(),

            checkInAt: toIso(values.scheduledAt!,values.checkInAt),

            checkOutAt: toIso(values.scheduledAt!,values.checkOutAt),
        };
        if (!visitLog) return;
        mutation.mutate({ id: visitLog.id, data: payload });
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-115 p-0 flex flex-col gap-0 overflow-hidden">

                {/* ── Header ── */}
                <SheetHeader className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-700 flex items-center justify-center shrink-0">
                            <Repeat className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0 flex-1 pt-0.5">
                            <SheetTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                Edit Visit Log
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-400 mt-0.5 truncate">
                                {visitLog?.careAgent?.user.name ?? "Loading…"} → {visitLog?.assignment?.careReceiver?.name ?? ""}
                            </SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                {/* ── Form body ── */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <Form {...form}>
                        <form
                            id="edit-visit-log-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5"
                        >

                            <SectionLabel>Visit Details</SectionLabel>

                            <div className="grid grid-cols-2 gap-3">

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={labelClass}>
                                                Visit Status
                                            </FormLabel>

                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className={inputClass}>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    <SelectItem value="SCHEDULED">
                                                        Scheduled
                                                    </SelectItem>

                                                    <SelectItem value="IN_PROGRESS">
                                                        In Progress
                                                    </SelectItem>

                                                    <SelectItem value="COMPLETED">
                                                        Completed
                                                    </SelectItem>

                                                    <SelectItem value="MISSED">
                                                        Missed
                                                    </SelectItem>

                                                    <SelectItem value="CANCELLED">
                                                        Cancelled
                                                    </SelectItem>

                                                </SelectContent>
                                            </Select>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="scheduledAt"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel className={labelClass}>
                                                Scheduled At
                                            </FormLabel>

                                            <FormControl>
                                                <FieldWithIcon icon={Calendar}>
                                                    <Input
                                                        {...field}
                                                        type="datetime-local"
                                                        className={inputClass}
                                                    />
                                                </FieldWithIcon>
                                            </FormControl>

                                            <FormMessage className="text-xs" />

                                        </FormItem>
                                    )}
                                />
                            </div>


                            <div className="grid grid-cols-2 gap-3">




                                <FormField
                                    control={form.control}
                                    name="checkInAt"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel className={labelClass}>
                                                Check In
                                            </FormLabel>

                                            <FormControl>
                                                <FieldWithIcon icon={Clock}>
                                                    <Input
                                                        {...field}
                                                        type="datetime-local"
                                                        className={inputClass}
                                                    />
                                                </FieldWithIcon>
                                            </FormControl>

                                            <FormMessage className="text-xs" />

                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="checkOutAt"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel className={labelClass}>
                                                Check Out
                                            </FormLabel>

                                            <FormControl>
                                                <FieldWithIcon icon={Clock}>
                                                    <Input
                                                        {...field}
                                                        type="datetime-local"
                                                        className={inputClass}
                                                    />
                                                </FieldWithIcon>
                                            </FormControl>

                                            <FormMessage className="text-xs" />

                                        </FormItem>
                                    )}
                                />

                            </div>







                            <FormField
                                control={form.control}
                                name="cancellationReason"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Cancellation Reason
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-20 resize-none")}
                                                placeholder="Reason for cancellation..."
                                            />
                                        </FormControl>

                                        <FormMessage className="text-xs" />

                                    </FormItem>
                                )}
                            />



                            <SectionLabel>Vitals</SectionLabel>


                            <div className="grid grid-cols-2 gap-3">

                                {[
                                    ["bloodPressureSystolic", "BP Systolic"],
                                    ["bloodPressureDiastolic", "BP Diastolic"],
                                    ["pulseRate", "Pulse Rate"],
                                    ["temperature", "Temperature"],
                                    ["oxygenSaturation", "Oxygen Saturation"],
                                    ["weight", "Weight"],
                                    ["bloodSugar", "Blood Sugar"],
                                    ["respiratoryRate", "Respiratory Rate"],
                                ].map(([name, label]) => (

                                    <FormField
                                        key={name}
                                        control={form.control}
                                        name={name as any}
                                        render={({ field }) => (
                                            <FormItem>

                                                <FormLabel className={labelClass}>
                                                    {label}
                                                </FormLabel>

                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value === ""
                                                                    ? undefined
                                                                    : Number(e.target.value)
                                                            )
                                                        }
                                                        type="number"
                                                        className={inputClass}
                                                    />
                                                </FormControl>

                                                <FormMessage className="text-xs" />

                                            </FormItem>
                                        )}
                                    />

                                ))}

                            </div>




                            <SectionLabel>Wellbeing</SectionLabel>


                            <div className="grid grid-cols-2 gap-3">


                                <FormField
                                    control={form.control}
                                    name="painLevel"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel className={labelClass}>
                                                Pain Level
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    type="number"
                                                    className={inputClass}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value
                                                                ? Number(e.target.value)
                                                                : undefined
                                                        )
                                                    }
                                                />
                                            </FormControl>

                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    control={form.control}
                                    name="mood"
                                    render={({ field }) => (
                                        <FormItem>

                                            <FormLabel className={labelClass}>
                                                Mood
                                            </FormLabel>


                                            <Select
                                                value={field.value ?? ""}
                                                onValueChange={field.onChange}
                                            >

                                                <FormControl>
                                                    <SelectTrigger className={inputClass}>
                                                        <SelectValue placeholder="Select mood" />
                                                    </SelectTrigger>
                                                </FormControl>


                                                <SelectContent>
                                                    <SelectItem value="GOOD">
                                                        Good
                                                    </SelectItem>
                                                    <SelectItem value="NEUTRAL">
                                                        Neutral
                                                    </SelectItem>
                                                    <SelectItem value="LOW">
                                                        Low
                                                    </SelectItem>
                                                </SelectContent>

                                            </Select>

                                        </FormItem>
                                    )}
                                />

                            </div>





                            <SectionLabel>Medications</SectionLabel>


                            <FormField
                                control={form.control}
                                name="medicationsGiven"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Medications Given
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-20 resize-none")}
                                                placeholder="Medication details..."
                                            />
                                        </FormControl>

                                    </FormItem>
                                )}
                            />



                            <FormField
                                control={form.control}
                                name="medicationsSkipped"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Medications Skipped
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-20 resize-none")}
                                                placeholder="Skipped medications..."
                                            />
                                        </FormControl>

                                    </FormItem>
                                )}
                            />




                            <SectionLabel>Clinical</SectionLabel>


                            <FormField
                                control={form.control}
                                name="symptoms"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Symptoms
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-20 resize-none")}
                                            />
                                        </FormControl>

                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="woundCare"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Wound Care
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-20 resize-none")}
                                            />
                                        </FormControl>

                                    </FormItem>
                                )}
                            />



                            <SectionLabel>Mobility</SectionLabel>


                            <FormField
                                control={form.control}
                                name="mobilityNotes"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Mobility Notes
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-20 resize-none")}
                                            />
                                        </FormControl>

                                    </FormItem>
                                )}
                            />




                            <SectionLabel>Notes</SectionLabel>


                            <FormField
                                control={form.control}
                                name="agentNotes"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormLabel className={labelClass}>
                                            Agent Notes
                                        </FormLabel>

                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className={cn(inputClass, "h-24 resize-none")}
                                                placeholder="Visit notes..."
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
                            form="edit-visit-log-form"
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
