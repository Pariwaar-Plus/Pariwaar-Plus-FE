import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const saharaStaffSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),

    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    secondaryPhone: optionalString,
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date of birth",
    }),

    qualification: z.string().min(2, "Qualification is required"),
    experience: z.number().min(0, "Experience cannot be negative"),
    specialization: optionalString,

    city: z.string().min(2, "City is required"),
    ward: z.string().min(1, "Ward is required"),
    tole: z.string().min(1, "Tole is required"),
    district: optionalString,

    longitude: z.number().optional(),
    latitude: z.number().optional(),

    citizenshipNo: z.string().min(1, "Citizenship number is required"),
    licenseNo: optionalString,
});

export const updateSaharaStaffSchema =
    saharaStaffSchema
        .omit({
            email: true,
            password: true,
    })
        .partial();

export type UpdateSaharaStaffFormValues = z.infer<typeof updateSaharaStaffSchema>;


export type SaharaStaffFormValues = z.infer<typeof saharaStaffSchema>;