import { CareAgent } from "@/features/sahara-staff/types/sahara-staff.type"
import { SaharaStaffFormValues, UpdateSaharaStaffFormValues } from "../schemas/care-agent.schema"
import { ApiResponse, CareAgentProfile } from "@/features/sahara-staff/types/sahara-staff.type";
import api from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

type RegisterCareAgentResponse = ApiResponse<CareAgent>;

// GET ALL
export const getCareAgents = async (): Promise<CareAgent[]> => {
    try {
        const response = await api.get<CareAgent[]>("/care-agent");
        return response.data
    } catch (error) {
        throw handleApiError(error, "Failed to get sahara staff");
    }
};

// CREATE
export const createCareAgent = async (
    data: SaharaStaffFormValues
): Promise<CareAgent> => {

    try {
        const response = await api.post<RegisterCareAgentResponse>(
            `${API_URL}/care-agent/registerCareAgent`,
            data
        );
        return response.data.data;
    } catch (error) {
        throw handleApiError(error, "Failed to register sahara staff");

    }
}

// -----------------------------
// UPDATE
// -----------------------------
export const updateCareAgent = async (
    id: string,
    data: UpdateSaharaStaffFormValues
): Promise<ApiResponse<CareAgent>> => {

    try {
        const response = await api.patch<ApiResponse<CareAgent>>(
            `${API_URL}/care-agent/${id}`,
            data
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to update care agent");
    }
}

// -----------------------------
// DELETE
// -----------------------------
export const deleteCareAgent = async (
    id: string
): Promise<{ success: true }> => {
    try {
        await api.delete(`${API_URL}/care-agent/${id}`);
        return { success: true };
    } catch (error) {
        throw handleApiError(error, "Failed to delete care agent");
    }
}

export const getCareAgentProfile = async (
    id: string
): Promise<CareAgentProfile> => {
    try {
        const response = await api.get<{ success: boolean; data: CareAgentProfile }>(
            `/care-agent/${id}`
        );
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(
                axiosError.response?.data?.message || axiosError.message
            );
        }
        throw new Error("Failed to fetch care agent profile");
    }
};