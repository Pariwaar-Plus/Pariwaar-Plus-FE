import { CareAgent } from "@/features/sahara-staff/types/sahara-staff.type";
import { CareReceiver } from "@/features/care-receiver/types/care-receiver.type";
import { VisitLog } from "@/features/visit-log/types/visit-log.type";

export type AssignmentStatus = "ACTIVE" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
export type VisitFrequency = "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "ON_DEMAND";
export type VisitStatus = "SCHEDULED" | "COMPLETED" | "MISSED" | "CANCELLED";


export interface CareAssignmentSchedule {
    id: string;
    frequency: VisitFrequency;
    startDate: string;
    endDate: string | null;
    nextVisit: Date;
    recentVisits:VisitLog[]
}

export interface CareAssignment {
    id: string;
    careAgentId: string;
    careReceiverId: string;

    // Joined relations (when included)
    careAgent?: CareAgent;
    careReceiver?: CareReceiver;
    status: AssignmentStatus;
    notes: string | null;
    schedule: CareAssignmentSchedule;

    // Meta
    createdAt: string;
    updatedAt: string;
}