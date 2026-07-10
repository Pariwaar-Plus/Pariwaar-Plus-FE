import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));
const optionalInt = z.coerce.number().int().optional();
const optionalFloat = z.coerce.number().optional();

export const visitLogSchema = z.object({
    // ── Core ──
    assignmentId: z.string().min(1, "Assignment is required"),
    careAgentId: z.string().min(1, "Care agent is required"),
    scheduledAt: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid scheduled date",
    }),
    checkInAt: z.string().optional().refine(
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
    bloodPressureSystolic: optionalInt,
    bloodPressureDiastolic: optionalInt,
    pulseRate: optionalInt,
    temperature: optionalFloat,
    oxygenSaturation: optionalFloat,
    weight: optionalFloat,
    bloodSugar: optionalFloat,
    respiratoryRate: optionalInt,

    // ── Pain & Wellbeing ──
    painLevel: z.coerce.number().int().min(0).max(10).optional(),
    mood: z.enum([
        "HAPPY", "CALM", "ANXIOUS",
        "CONFUSED", "AGITATED", "DEPRESSED",
    ]).optional(),

    // ── Medications ──
    medicationsGiven: optionalString,
    medicationsSkipped: optionalString,

    // ── Clinical ──
    symptoms: optionalString,
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



export const updateVisitLogSchema = visitLogSchema
    .partial();

export type VisitLogFormValues = z.infer<typeof visitLogSchema>;
export type UpdateVisitLogFormValues = z.infer<typeof updateVisitLogSchema>;

/**
 * Schema for the care-agent "Log Visit" form.
 *
 * Unlike `visitLogSchema`, this omits `careAgentId` (the backend infers it
 * from the JWT). `assignmentId` is supplied by the modal, not typed by the user.
 */
// Treat blank inputs as "not provided" before coercing to a number,
// so empty vital fields stay undefined instead of becoming 0.
const blankToUndef = (v: unknown) =>
    v === "" || v === null || v === undefined ? undefined : v;
// const formInt = z.preprocess(blankToUndef, z.coerce.number().int().optional());
// const formFloat = z.preprocess(blankToUndef, z.coerce.number().optional());


const formInt = z.number().int().optional();
const formFloat = z.number().optional();

export const logVisitFormSchema = z
    .object({
        assignmentId: z.string().min(1, "Assignment is required"),
        scheduledAt: z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: "Invalid scheduled date",
        }),
        checkInAt: optionalString,
        checkOutAt: optionalString,

        status: z
            .enum(["SCHEDULED", "COMPLETED", "MISSED", "CANCELLED"]),
        cancellationReason: optionalString,

        // Vitals
        bloodPressureSystolic: formInt,
        bloodPressureDiastolic: formInt,
        pulseRate: formInt,
        temperature: formFloat,
        oxygenSaturation: formFloat,
        weight: formFloat,
        bloodSugar: formFloat,
        respiratoryRate: formInt,

        // Pain & wellbeing
        painLevel: z.number().int().min(0).max(10).optional(),
        mood: z
            .enum(["HAPPY", "CALM", "ANXIOUS", "CONFUSED", "AGITATED", "DEPRESSED"])
            .optional(),

        // Medications
        medicationsGiven: optionalString,
        medicationsSkipped: optionalString,

        // Clinical
        symptoms: optionalString,
        woundCare: optionalString,
        woundCondition: z
            .enum(["HEALING", "STABLE", "WORSENING", "INFECTED", "NOT_APPLICABLE"])
            .optional(),

        // Mobility
        mobilityAssessment: z
            .enum(["INDEPENDENT", "ASSISTED", "WHEELCHAIR", "BEDRIDDEN"])
            .optional(),
        mobilityNotes: optionalString,

        // Notes
        agentNotes: optionalString,
    })
    .refine(
        (data) => {
            if (data.status === "MISSED" || data.status === "CANCELLED") {
                return !!data.cancellationReason;
            }
            return true;
        },
        {
            message: "Cancellation reason required for missed or cancelled visits",
            path: ["cancellationReason"],
        }
    );

export type LogVisitFormValues = z.infer<typeof logVisitFormSchema>;