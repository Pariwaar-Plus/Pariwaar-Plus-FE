import { CareAssignment } from "@/features/care-assignment/types/care-assignment.type";
import { Client, ClientOut } from "@/features/clients/types/client.type";

export type MobilityStatus =
    | "INDEPENDENT"
    | "ASSISTED"
    | "WHEELCHAIR"
    | "BEDRIDDEN";

export interface CareReceiver {
    id: string;
    clientId: string;
    client: ClientOut

    // Personal
    name: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";

    // Contact & Location
    phone: string | null;
    city: string;
    district: string | null;
    ward: string;
    tole: string;

    // Medical
    bloodGroup?: string | null;
    medicalCondition?: string | null;
    allergies?: string | null;
    mobilityStatus: MobilityStatus;
    notes?: string | null;

    // Emergency Contact
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;

    // Relations
    assignments?: CareAssignment[] | null;

}