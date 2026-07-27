import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

// ── Client ──
export const clientSchema = z.object({
    name:           z.string().min(2, "Name is required"),
    email:          z.string().email("Invalid email address"),
    password:       z.string().min(6, "Password must be at least 6 characters"),
    phone:          z.string().min(7, "Valid phone number required"),
    countryCode:    z.string().min(2, "Country code is required"),
    secondaryPhone: optionalString,
    country:        z.string().min(2, "Country is required"),
    timezone:       z.string().min(2, "Timezone is required"),
    address:        optionalString,
    city:           optionalString,
    billingType:    z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
    paymentStatus:  z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]),
});

export const updateClientSchema = clientSchema
    .omit({ email: true, password: true })
    .partial();

export type ClientFormValues       = z.infer<typeof clientSchema>;
export type UpdateClientFormValues = z.infer<typeof updateClientSchema>;