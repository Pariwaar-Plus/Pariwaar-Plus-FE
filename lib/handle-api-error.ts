import axios, { AxiosError } from "axios";

export const handleApiError = (error: unknown, fallback: string): never => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message: string }>;
        throw new Error(axiosError.response?.data?.message || axiosError.message);
    }
    throw new Error(fallback);
};