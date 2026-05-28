import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const careReceiverSchema = z.object({
    clientId: z.string().uuid("Invalid client ID"),

    // Personal
    name:        z.string().min(2, "Name is required"),
    dateOfBirth: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid date of birth",
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),

    // Contact & Location
    phone:    optionalString,
    city:     z.string().min(2, "City is required"),
    district: optionalString,
    ward:     z.string().min(1, "Ward is required"),
    tole:     z.string().min(1, "Tole is required"),

    // Medical
    bloodGroup:       optionalString,
    medicalCondition: optionalString,
    allergies:        optionalString,
    mobilityStatus:   z.enum([
        "INDEPENDENT",
        "ASSISTED",
        "WHEELCHAIR",
        "BEDRIDDEN",
    ]).default("INDEPENDENT"),
    notes: optionalString,

    // Emergency Contact
    emergencyContactName:  optionalString,
    emergencyContactPhone: optionalString,
});

export const updateCareReceiverSchema = careReceiverSchema
    .omit({ clientId: true })
    .partial();

export type CareReceiverFormValues       = z.infer<typeof careReceiverSchema>;
export type UpdateCareReceiverFormValues = z.infer<typeof updateCareReceiverSchema>;