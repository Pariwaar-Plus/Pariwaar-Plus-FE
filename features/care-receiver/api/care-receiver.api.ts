import api from "@/lib/axios";
import { CareReceiver } from "../types/care-receiver.type";
import axios, { AxiosError } from "axios";
import { handleApiError } from "@/lib/handle-api-error";

// mock DB (temporary)
// let careReceivers: CareReceiver[] = [
//     {
//         id: "r1",
//         name: "Hari Sharma",
//         dateOfBirth: "1948-03-12",
//         gender: "MALE",

//         city: "Kathmandu",
//         // googleMapsUrl: "https://maps.google.com/example",
//         phone: "9800000000",

//         medicalCondition: "Diabetes, Hypertension",
//         // dependencyLevel: "HIGH",

//         clientId: "c1",
//         // assignedAgentId: "1",

//         status: "ACTIVE",

//         createdAt: new Date().toISOString(),
//     },
// ];

// delay helper
const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

//    READ
export const getCareReceivers = async (): Promise<CareReceiver[]> => {
    await delay(600);
    const response = await api.get('/care-receiver/');
    return response.data
};

export const getCareReceiverProfile = async (id: string): Promise<CareReceiver> => {
    try {
        const response = await api.get<{ success: boolean; data: CareReceiver }>(
            `/care-receiver/${id}`
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

//    CREATE
export const createCareReceiver = async (
    data: Omit<CareReceiver, "id" | "createdAt" | "updatedAt">
): Promise<CareReceiver> => {

    const response = await api.post("/care-receiver", data)
    console.log(response)

    return data;
};

//    UPDATE
export const updateCareReceiver = async (
    id: string,
    data: Partial<CareReceiver>
): Promise<CareReceiver> => {
    try {
        const response = await api.patch<CareReceiver>(
            `/care-receiver/${id}`,
            data
        );
        return response.data;
    } catch (error) {
        throw handleApiError(error, "Failed to update client");
    }
};

//    DELETE
export const deleteCareReceiver = async (
    id: string
): Promise<{ id: string }> => {
    await delay(500);

    const exists = careReceivers.some((r) => r.id === id);

    if (!exists) {
        throw new Error("Care Receiver not found");
    }

    careReceivers = careReceivers.filter((r) => r.id !== id);

    return { id };
};