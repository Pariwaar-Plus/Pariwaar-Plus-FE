import { z } from "zod";

const optionalString = z.string().nullable().optional();

export const careReceiverSchema = z.object({
    clientId: z.uuid("Invalid client ID"),

    // Personal
    name: z.string().min(2, "Name is required"),
    dateOfBirth: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid date of birth",
    }),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),

    // Contact & Location
    phone: z
        .string()
        .regex(/^98\d{8}$/, "Phone number must start with 98 and be exactly 10 digits"),
    city: z.string().min(2, "City is required"),
    district: z.string().min(2, "District is required"),
    ward: z.string().min(2, "Ward No is required"),
    tole: z.string().min(2, "Tole name is required"),

    // Medical
    bloodGroup: optionalString,
    medicalCondition: optionalString,
    allergies: optionalString,
    mobilityStatus: z.enum([
        "INDEPENDENT",
        "ASSISTED",
        "WHEELCHAIR",
        "BEDRIDDEN",
    ]),
    notes: optionalString,

    // Emergency Contact
    emergencyContactName: optionalString,
    emergencyContactPhone: optionalString,
});

export const updateCareReceiverSchema = careReceiverSchema
    .omit({ clientId: true })
    .partial();

export type CareReceiverFormValues = z.infer<typeof careReceiverSchema>;
export type UpdateCareReceiverFormValues = z.infer<typeof updateCareReceiverSchema>;