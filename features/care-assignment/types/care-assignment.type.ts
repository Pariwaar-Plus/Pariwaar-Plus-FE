import { CareAgent } from "@/features/sahara-staff/types/sahara-staff.type";
import { CareReceiver } from "@/features/care-receiver/types/care-receiver.type";

export type AssignmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD" | "INACTIVE";

export interface CareAssignment {
    id: string;
    careAgentId: string;
    careReceiverId: string;

    // Joined relations (when included)
    careAgent?:    CareAgent;
    careReceiver?: CareReceiver;

    status:    AssignmentStatus;
    startDate: string;
    endDate:   string | null;
    notes:     string | null;

    // Meta
    createdAt: string;
    updatedAt: string;
}