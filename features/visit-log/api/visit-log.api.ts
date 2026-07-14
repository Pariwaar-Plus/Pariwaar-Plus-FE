import api, { ApiResponse } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import { VisitLog, VisitStatus } from "../types/visit-log.type";
import { UpdateVisitLogFormValues } from "../schemas/visit-log.schema";

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
        const response = await api.post<VisitLog>("/visit-logs/log", data);
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
    careReceiverId: string,
    visitId?: string
): Promise<VisitLog[]> => {
    try {
        const url = `/visit-logs/history/care-receiver/${careReceiverId}`
        const response = await api.get<ApiResponse<VisitLog[]>>(url);
        return response.data.data;
    } catch (error) {
        throw handleApiError(error, "Failed to load visit history");
    }
};
export interface GetVisitLogsQuery {
    page?: number;
    limit?: number;

    careAgentId?: string;
    careReceiverId?: string;

    status?: string;

    from?: string;
    to?: string;
}
// export async function getVisitLogsWithFilter() {
//   const { data } = await api.get("/visit-log");

//   return data;
// }

export const getVisitLogs = async (
    params: GetVisitLogsQuery = {}
): Promise<VisitLog[]> => {
    try {
          const filteredParams = Object.fromEntries(
            Object.entries(params).filter(
                ([_, value]) => value !== "" && value !== undefined
            )
        );

        const response = await api.get<ApiResponse<VisitLog[]>>(
            `/visit-logs`,
            {
                params:filteredParams
            }
        );

        return response.data.data;
    } catch (error) {
        throw handleApiError(error, "Failed to load visit history");
    }
};


export const getVisitLogById = async (
    visitLogId: string,
): Promise<VisitLog> => {
    try {
        const response = await api.get<ApiResponse<VisitLog>>(
            `/visit-logs/${visitLogId}`
        );
        return response.data.data;
    } catch (error) {
        throw handleApiError(error, "Failed to load visit history");
    }
};

export const updateVisitLog = async (
    visitLogId: string, data: UpdateVisitLogFormValues
): Promise<VisitLog> => {
    try {
        const response = await api.patch<VisitLog>(
            `/visit-logs/${visitLogId}`,
            data
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to create client");
    }
};

export const deleteVisitLog = async (
    visitLogId: string
): Promise<void> => {

    try {

        await api.delete(
            `/visit-logs/${visitLogId}`
        );

    } catch (error) {

        throw handleApiError(
            error,
            "Failed to delete visit log"
        );

    }
};



