"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { logVisit, LogVisitPayload } from "../api/visit-log.api";
import {
    logVisitFormSchema,
    LogVisitFormValues,
} from "../schemas/visit-log.schema";

interface LogVisitModalProps {
    assignmentId: string | null;
    careReceiverId: string | null;
    receiverName?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// datetime-local wants "yyyy-MM-ddTHH:mm" in local time.
const nowLocal = () => format(new Date(), "yyyy-MM-dd'T'HH:mm");
export const toIso = (scheduledDate: string, v?: string) => {

    if (v) {

        const myDate = new Date(scheduledDate);

        // 4. Split the string into numbers
        const [hours, minutes] = v.split(":").map(Number);

        // 5. Update the Date object's hours and minutes
        myDate.setHours(hours, minutes, 0, 0);
        return myDate.toISOString()
    } else {
        return undefined
    }


}
const clean = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined);


type NumberInputProps = React.ComponentProps<typeof Input> & {
    value: number | undefined;
    onChange: (value: number | undefined) => void;
};

function NumberInput({
    value,
    onChange,
    ...props
}: NumberInputProps) {
    return (
        <Input
            type="number"
            {...props}
            value={value ?? ""}
            onChange={(e) =>
                onChange(
                    e.target.value === "" ? undefined : e.target.valueAsNumber
                )
            }
        />
    );
}

export function LogVisitModal({
    assignmentId,
    careReceiverId,
    receiverName,
    open,
    onOpenChange,
}: LogVisitModalProps) {
    const queryClient = useQueryClient();

    const form = useForm<LogVisitFormValues>({
        resolver: zodResolver(logVisitFormSchema),
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

    // Keep the hidden assignmentId in sync when the modal is opened for a row.
    React.useEffect(() => {
        if (open && assignmentId) {
            form.setValue("assignmentId", assignmentId);
            form.setValue("scheduledAt", nowLocal());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, assignmentId]);

    const status = form.watch("status");
    const needsReason = status === "MISSED" || status === "CANCELLED";

    const mutation = useMutation({
        mutationFn: logVisit,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["visit-history", careReceiverId],
            });
            queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
            toast.success("Visit logged successfully");
            form.reset();
            onOpenChange(false);
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to log visit");
        },
    });

    const onSubmit = (values: LogVisitFormValues) => {
        const payload: LogVisitPayload = {
            assignmentId: values.assignmentId,
            scheduledAt: new Date(values.scheduledAt).toISOString(),
            checkInAt: toIso(values.scheduledAt, values.checkInAt,),
            checkOutAt: toIso(values.scheduledAt, values.checkOutAt),
            status: values.status,
            cancellationReason: clean(values.cancellationReason),

            bloodPressureSystolic: values.bloodPressureSystolic,
            bloodPressureDiastolic: values.bloodPressureDiastolic,
            pulseRate: values.pulseRate,
            temperature: values.temperature,
            oxygenSaturation: values.oxygenSaturation,
            weight: values.weight,
            bloodSugar: values.bloodSugar,
            respiratoryRate: values.respiratoryRate,

            painLevel: values.painLevel,
            mood: values.mood,

            medicationsGiven: clean(values.medicationsGiven),
            medicationsSkipped: clean(values.medicationsSkipped),

            symptoms: clean(values.symptoms),
            woundCare: clean(values.woundCare),
            woundCondition: values.woundCondition,

            mobilityAssessment: values.mobilityAssessment,
            mobilityNotes: clean(values.mobilityNotes),

            agentNotes: clean(values.agentNotes),
        };

        mutation.mutate(payload);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>Log a Visit</DialogTitle>
                    <DialogDescription>
                        {receiverName
                            ? `Record a visit and health observations for ${receiverName}.`
                            : "Record a visit and health observations."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="max-h-[68vh] space-y-5 overflow-y-auto pr-1 pt-2"
                    >
                        {/* Timing & status */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="scheduledAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visit Date & Time</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                                                <SelectItem value="MISSED">Missed</SelectItem>
                                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {needsReason ? (
                            <FormField
                                control={form.control}
                                name="cancellationReason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={2}
                                                placeholder="Why was the visit missed or cancelled?"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="checkInAt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Check-in (optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="checkOutAt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Check-out (optional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Vitals */}
                                <div>
                                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                                        Vitals
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <FormField
                                            control={form.control}
                                            name="bloodPressureSystolic"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">BP Systolic</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            placeholder="120"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bloodPressureDiastolic"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">BP Diastolic</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            placeholder="80"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                        {/* <Input type="number" placeholder="80" {...field} value={field.value ?? ""} /> */}
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="pulseRate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Pulse (bpm)</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            placeholder="72"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="temperature"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Temp (°C)</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            step="0.1"
                                                            placeholder="36.7"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="oxygenSaturation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">SpO₂ (%)</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            step="0.1"
                                                            placeholder="98"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="bloodSugar"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Sugar (mg/dL)</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            step="0.1"
                                                            placeholder="110"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="respiratoryRate"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Resp (/min)</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            placeholder="16"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Weight (kg)</FormLabel>
                                                    <FormControl>
                                                        <NumberInput
                                                            step="0.1"
                                                            placeholder="65"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Wellbeing */}
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="painLevel"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Pain (0–10)</FormLabel>
                                                <FormControl>
                                                    <NumberInput
                                                        min={0} max={10} placeholder="0"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mood"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mood</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select mood" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="HAPPY">Happy</SelectItem>
                                                        <SelectItem value="CALM">Calm</SelectItem>
                                                        <SelectItem value="ANXIOUS">Anxious</SelectItem>
                                                        <SelectItem value="CONFUSED">Confused</SelectItem>
                                                        <SelectItem value="AGITATED">Agitated</SelectItem>
                                                        <SelectItem value="DEPRESSED">Depressed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Medications */}
                                <FormField
                                    control={form.control}
                                    name="medicationsGiven"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Medications given</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Metformin 500mg, Amlodipine 5mg"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="symptoms"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Symptoms / observations</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={2}
                                                    placeholder="e.g. mild cough, fatigue"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="agentNotes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Visit notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    rows={3}
                                                    placeholder="General notes about the visit"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={mutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Saving..." : "Save Visit"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
