import api from "@/lib/axios";

import {
    User,
    LoginRequest,
    LoginResponse,
} from "../types/auth.type";

/**
 * LOGIN
 * Sends credentials → receives token + user
 */
export const login = async (
    data: LoginRequest
): Promise<LoginResponse> => {
    const res = await api.post<LoginResponse>("/auth/login", data);

    return res.data;
};

/**
 * GET CURRENT USER
 * Requires valid access token
 */
export const getMe = async (): Promise<User> => {
    const res = await api.get<User>("/auth/me");
    return res.data;
};

/**
 * LOGOUT
 * Usually invalidates refresh token on backend
 * (frontend cleanup is handled in store/token layer)
 */
export const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
};

/**
 * OPTIONAL: MANUAL REFRESH (rarely needed because axios handles it)
 */
export const refreshToken = async (): Promise<{ accessToken: string }> => {
    const res = await api.post<{ accessToken: string }>("/auth/refresh", {}, {
        withCredentials: true,
    });

    return res.data;
};


export const forgotPassword = async (data: {
    email: string;
}): Promise<void> => {
    await api.post("/auth/forgot-password", data);
};

export const validateResetToken = async (data: {
    token: string
}): Promise<string> => {
    return await api.post("/auth/reset-password/validate", data);
}

/**
 * CHANGE PASSWORD
 * Used from the profile page (e.g. to replace a temporary password).
 * Backend reads the acting user from the JWT (authMiddleware).
 */
export const changePassword = async (data: {
    token: string;
    password: string;
}): Promise<void> => {
    await api.post("/auth/reset-password", data);
};