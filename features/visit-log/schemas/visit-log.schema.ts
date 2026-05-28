import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));
const optionalInt    = z.coerce.number().int().optional();
const optionalFloat  = z.coerce.number().optional();

export const visitLogSchema = z.object({
    // ── Core ──
    assignmentId: z.string().min(1, "Assignment is required"),
    careAgentId:  z.string().min(1, "Care agent is required"),
    scheduledAt:  z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid scheduled date",
    }),
    checkInAt:  z.string().optional().refine(
        (v) => !v || !isNaN(Date.parse(v)),
        { message: "Invalid check-in time" }
    ),
    checkOutAt: z.string().optional().refine(
        (v) => !v || !isNaN(Date.parse(v)),
        { message: "Invalid check-out time" }
    ),

  // ── Status ──
    status: z.enum(["SCHEDULED", "COMPLETED", "MISSED", "CANCELLED"])
            .default("SCHEDULED"),
    cancellationReason: optionalString,

    // ── Vitals ──
    bloodPressureSystolic:  optionalInt,
    bloodPressureDiastolic: optionalInt,
    pulseRate:              optionalInt,
    temperature:            optionalFloat,
    oxygenSaturation:       optionalFloat,
    weight:                 optionalFloat,
    bloodSugar:             optionalFloat,
    respiratoryRate:        optionalInt,

    // ── Pain & Wellbeing ──
    painLevel: z.coerce.number().int().min(0).max(10).optional(),
    mood:      z.enum([
        "HAPPY", "CALM", "ANXIOUS",
        "CONFUSED", "AGITATED", "DEPRESSED",
    ]).optional(),

    // ── Medications ──
    medicationsGiven:   optionalString,
    medicationsSkipped: optionalString,

    // ── Clinical ──
    symptoms:  optionalString,
    woundCare: optionalString,
    woundCondition: z.enum([
        "HEALING", "STABLE", "WORSENING",
        "INFECTED", "NOT_APPLICABLE",
    ]).optional(),

    // ── Mobility ──
    mobilityAssessment: z.enum([
        "INDEPENDENT", "ASSISTED",
        "WHEELCHAIR", "BEDRIDDEN",
    ]).optional(),
    mobilityNotes: optionalString,

    // ── Notes ──
    agentNotes: optionalString,
    adminNotes: optionalString,
})
.refine(
    (data) => {
        if (data.checkInAt && data.checkOutAt) {
            return new Date(data.checkOutAt) > new Date(data.checkInAt);
        }
        return true;
    },
    { message: "Check-out must be after check-in", path: ["checkOutAt"] }
)
.refine(
    (data) => {
        if (data.status === "MISSED" || data.status === "CANCELLED") {
            return !!data.cancellationReason;
        }
        return true;
    },
    { message: "Cancellation reason required for missed or cancelled visits",
    path: ["cancellationReason"] }
);

export const updateVisitLogSchema = visitLogSchema
    .omit({ assignmentId: true, careAgentId: true })
    .partial()
    // keep cross-field refinements on update too
    .refine(
    (data) => {
        if (data.checkInAt && data.checkOutAt) {
            return new Date(data.checkOutAt) > new Date(data.checkInAt);
        }
        return true;
    },
    { message: "Check-out must be after check-in", path: ["checkOutAt"] }
    )
    .refine(
    (data) => {
        if (data.status === "MISSED" || data.status === "CANCELLED") {
            return !!data.cancellationReason;
        }
        return true;
    },
    { message: "Cancellation reason required", path: ["cancellationReason"] }
);

export type VisitLogFormValues       = z.infer<typeof visitLogSchema>;
export type UpdateVisitLogFormValues = z.infer<typeof updateVisitLogSchema>;