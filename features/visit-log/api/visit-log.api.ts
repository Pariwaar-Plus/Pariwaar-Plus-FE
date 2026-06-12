import api from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import { VisitLog } from "../types/visit-log.type";

/**
 * Payload sent when a care-agent logs a visit.
 *
 * The backend infers `careAgentId` and `createdBy` from the JWT and the
 * care-receiver from the assignment — so the frontend only sends the
 * assignment plus the visit details.
 */
export interface LogVisitPayload {
    assignmentId: string;
    scheduledAt: string;

    checkInAt?: string;
    checkOutAt?: string;

    status: VisitLog["status"];
    cancellationReason?: string;

    // Vitals
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    pulseRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
    weight?: number;
    bloodSugar?: number;
    respiratoryRate?: number;

    // Pain & wellbeing
    painLevel?: number;
    mood?: VisitLog["mood"];

    // Medications
    medicationsGiven?: string;
    medicationsSkipped?: string;

    // Clinical
    symptoms?: string;
    woundCare?: string;
    woundCondition?: VisitLog["woundCondition"];

    // Mobility
    mobilityAssessment?: VisitLog["mobilityAssessment"];
    mobilityNotes?: string;

    // Notes
    agentNotes?: string;
}

/**
 * CREATE — care-agent logs a visit.
 * POST /visit-log/log-visit
 */
export const logVisit = async (
    data: LogVisitPayload
): Promise<VisitLog> => {
    try {
        const response = await api.post<VisitLog>("/visit-log/log-visit", data);
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to log visit");
    }
};

/**
 * READ — visit history for a care-receiver.
 * GET /visit-log/history/:careReceiverId
 *
 * Backend scopes access by role (a care-agent only sees receivers they
 * are assigned to; a client only their own).
 */
export const getVisitHistory = async (
    careReceiverId: string
): Promise<VisitLog[]> => {
    try {
        const response = await api.get<VisitLog[]>(
            `/visit-log/history/${careReceiverId}`
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to load visit history");
    }
};
