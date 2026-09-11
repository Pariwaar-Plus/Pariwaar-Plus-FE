import { User } from "@/features/auth/types/auth.type";
import { CareReceiver } from "@/features/care-receiver/types/care-receiver.type";


export type BillingType   = "MONTHLY" | "QUARTERLY" | "YEARLY";
export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export interface Client {
    id:     string;
    userId: string;

    // User (flattened)
    name:  string;
    email: string;

    // Contact
    phone:          string;
    countryCode:    string;
    secondaryPhone: string | null;

    // Location
    country:  string;
    timezone: string;
    address:  string | null;
    city:     string | null;

    // Billing
    billingType:   BillingType;
    paymentStatus: PaymentStatus;

    // Relations
    careReceivers: CareReceiver[];

    // Meta
    createdAt: string;
    updatedAt: string;
}

export interface ClientOut {
    id: string;
    userId: string;
    user: User
    createdAt: string;
    updatedAt: string;
}