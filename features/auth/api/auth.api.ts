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