import api, { ApiResponse } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";


export interface Notifications {
    id: string;
    userId: string;
    type: string;
    content: string
    hasRead: boolean
    createdAt: string
}


// GET ALL
export const getNotifications = async (): Promise<Notifications[]> => {
    try {
        const response = await api.get<ApiResponse<Notifications[]>>("/notifications");
        return response.data.data
    } catch (error) {
        throw handleApiError(error, "Failed to fetch notification");
    }
};


export const updateNotification = async (id: string, data: { hasRead: boolean }): Promise<string> => {
    try {
        const response = await api.patch<ApiResponse<string>>(`/notifications/${id}`, data)
        return response.data.data
    } catch (error) {
        throw handleApiError(error, "Failed to update notification");
    }
}

export const markAllNotificationsAsRead = async (): Promise<string> => {
    try {
        const response = await api.patch<ApiResponse<string>>(`/notifications/read-all`)
        return response.data.data
    } catch (error) {
        throw handleApiError(error, "Failed to update notification");
    }
}

markAllNotificationsAsRead
