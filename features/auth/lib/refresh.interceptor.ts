// features/auth/lib/refresh.interceptor.ts

import axios, {
    AxiosError,
    AxiosInstance,
    InternalAxiosRequestConfig,
} from "axios";

import { refresh } from "../api/auth.api";

import {
    getAccessToken,
    setAccessToken,
    clearAccessToken,
} from "../utils/token";

import { useAuthStore } from "../store/auth.store";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

interface RefreshResponse {
    accessToken: string;
}

// ─────────────────────────────────────────────────────────────
// REFRESH LOCK
// Prevents multiple refresh calls at once
// ─────────────────────────────────────────────────────────────

let refreshPromise: Promise<string | null> | null = null;

// ─────────────────────────────────────────────────────────────
// REFRESH FUNCTION
// ─────────────────────────────────────────────────────────────

const refreshAccessToken = async (): Promise<string | null> => {
    // If refresh already running → reuse it
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const res: RefreshResponse = await refresh();

            if (!res.accessToken) {
                throw new Error("No access token received");
            }

            setAccessToken(res.accessToken);

            return res.accessToken;
        } catch (error) {
            console.error("[AUTH] Refresh failed:", error);

            clearAccessToken();

            // reset auth state
            useAuthStore.getState().reset();

            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
};

// ─────────────────────────────────────────────────────────────
// ATTACH INTERCEPTOR
// ─────────────────────────────────────────────────────────────

export const setupRefreshInterceptor = (api: AxiosInstance) => {
    // REQUEST INTERCEPTOR
    api.interceptors.request.use(
        (config) => {
            const token = getAccessToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // RESPONSE INTERCEPTOR
    api.interceptors.response.use(
        (response) => response,

        async (error: AxiosError) => {
            const originalRequest = error.config as RetryableRequestConfig;

            // No request config
            if (!originalRequest) {
                return Promise.reject(error);
            }

            // Already retried
            if (originalRequest._retry) {
                return Promise.reject(error);
            }

            // Only handle 401
            if (error.response?.status !== 401) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // Try refresh
            const newAccessToken = await refreshAccessToken();

            // Refresh failed
            if (!newAccessToken) {
                return Promise.reject(error);
            }

            // Update request header
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            // Retry original request
            return api(originalRequest);
        }
    );
};