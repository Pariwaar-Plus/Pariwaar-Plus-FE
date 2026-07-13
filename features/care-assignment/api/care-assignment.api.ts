import api from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import axios, { AxiosError } from "axios";
import { CareAssignmentFormValues, UpdateCareAssignmentFormValues } from "../schemas/care-assignment.schema";
import { CareAssignment } from "../types/care-assignment.type";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";


/**
 * MY ASSIGNMENTS (care-agent scoped)
 * Backend resolves the care-agent from the JWT — no id passed in the URL.
 * Returns the logged-in agent's assignments with `careReceiver` joined.
 */
export const getMyAssignments = async (): Promise<CareAssignment[]> => {
    try {
        const response = await api.get<CareAssignment[]>(
            `${API_URL}/care-assignment`
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to load your assignments");
    }
};

export const getCareAssignmentByCareReceiver = async (careReceiverId: string,): Promise<CareAssignment[]> => {
    try {
        const response = await api.get<CareAssignment[]>(
            `${API_URL}/care-assignment/?${careReceiverId = careReceiverId}`
        );
        return response.data.map((assignment) => ({
            ...assignment,
            name: assignment.careAgent?.user?.name,
            email: assignment.careAgent?.user?.email,
        }));
    } catch (error) {
        throw handleApiError(error, "Failed to create client");
    }
};

//    CREATE
export const createCareAssignment = async (
    data: CareAssignmentFormValues
): Promise<CareAssignment> => {

    try {
        const response = await api.post<CareAssignment>(
            `${API_URL}/care-assignment`,
            data
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to create client");
    }
};

//    CREATE
export const updateAssignment = async (
    id: string, data: UpdateCareAssignmentFormValues
): Promise<CareAssignment> => {

    try {
        const response = await api.patch<CareAssignment>(
            `${API_URL}/care-assignment/${id}`,
            data
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to create client");
    }
};


export const deleteCareAssignment = async (assignmentId: string) => {

    try {
        const response = await api.delete(
            `/care-assignment/${assignmentId}`
        );

        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to create client");
    }

};