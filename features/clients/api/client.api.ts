import { Client } from "../types/client.type";
import api from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import axios, { AxiosError } from "axios";
import { ClientFormValues, UpdateClientFormValues } from "../schemas/client.schema";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";


//  GET ALL
export const getClients = async (): Promise<Client[]> => {
    try {
        const response = await api.get<{
            success: boolean;
            count: number;
            data: any[];
        }>('/client/');
        return response.data.data.map((client) => ({
            ...client,
            name: client.user?.name,
            email: client.user?.email,
        }));
    } catch (error) {
        throw handleApiError(error, "Failed to get clients");
    }
};

//    CREATE
export const createClient = async (
    data: ClientFormValues
): Promise<Client> => {

    try{
        const response = await api.post<Client>(
            `${API_URL}/client/`,
            data
        );
        return response.data;
    }catch (error) {
        throw handleApiError(error, "Failed to create client");
    }
};

//    UPDATE
export const updateClient = async (
    id: string,
    data: UpdateClientFormValues
): Promise<Client> => {
    
    try{
        const response = await api.patch<Client>(
            `${API_URL}/client/${id}`,
            data
        );
        return response.data;
    }catch (error) {
        throw handleApiError(error, "Failed to update client");
    }
};

//    DELETE
export const deleteClient = async (id: string): Promise<{ success: true }> => {
    
    try{
        await api.delete(`/client/${id}`);
        return { success: true };
    } catch (error) {
        throw handleApiError(error, "Failed to delete client");
    }
};

// GET CLIENT PROFILE
export const getClientProfile = async (id: string): Promise<Client> => {
    try {
        const response = await api.get<{ success: boolean; data: Client }>(
            `/client/${id}`
        );
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message: string }>;
            throw new Error(
            axiosError.response?.data?.message || axiosError.message
            );
        }
        throw new Error("Failed to fetch client profile");
    }
}