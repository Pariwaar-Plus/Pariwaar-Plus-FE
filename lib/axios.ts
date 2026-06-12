// src/lib/axios.ts

import axios, {
    AxiosError,
    InternalAxiosRequestConfig,
} from "axios";

import {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
} from "@/features/auth/utils/token";

import { useAuthStore } from "@/features/auth/store/auth.store";

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

interface RetryRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

type QueueItem = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};

/* -------------------------------------------------------------------------- */
/* AXIOS INSTANCE */
/* -------------------------------------------------------------------------- */

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

/* -------------------------------------------------------------------------- */
/* REFRESH STATE */
/* -------------------------------------------------------------------------- */

let isRefreshing = false;

let failedQueue: QueueItem[] = [];

/* -------------------------------------------------------------------------- */
/* PROCESS FAILED QUEUE */
/* -------------------------------------------------------------------------- */

const processQueue = (
    error: unknown,
    token: string | null = null
) => {
    failedQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else if (token) {
            promise.resolve(token);
        }
    });

    failedQueue = [];
};

/* -------------------------------------------------------------------------- */
/* REQUEST INTERCEPTOR */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

/* -------------------------------------------------------------------------- */
/* RESPONSE INTERCEPTOR */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as RetryRequestConfig;

        /* ---------------- NON-401 ERRORS ---------------- */

        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        /* ---------------- PREVENT INFINITE LOOP ---------------- */

        if (originalRequest._retry) {
            useAuthStore.getState().reset();

            return Promise.reject(error);
        }

        originalRequest._retry = true;

        /* ---------------- IF REFRESH ALREADY RUNNING ---------------- */

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                }

                return api(originalRequest);
            });
        }

        /* ---------------- START REFRESH ---------------- */

        isRefreshing = true;

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                {},
                {
                    withCredentials: true,
                }
            );

            const newAccessToken = response.data.accessToken as string;

            /* ---------------- SAVE TOKEN ---------------- */

            setAccessToken(newAccessToken);

            api.defaults.headers.common.Authorization =
                `Bearer ${newAccessToken}`;

            /* ---------------- RETRY QUEUED REQUESTS ---------------- */

            processQueue(null, newAccessToken);

            /* ---------------- RETRY ORIGINAL REQUEST ---------------- */

            if (originalRequest.headers) {
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;
            }

            return api(originalRequest);

        } catch (refreshError) {

            /* ---------------- REFRESH FAILED ---------------- */

            processQueue(refreshError, null);

            clearAccessToken();

            useAuthStore.getState().reset();

            return Promise.reject(refreshError);

        } finally {
            isRefreshing = false;
        }
    }
);

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export default api;