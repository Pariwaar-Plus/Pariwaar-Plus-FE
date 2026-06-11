import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

import {
    login as loginApi,
    logout as logoutApi,
    getMe,
} from "../api/auth.api";

import {
    setAccessToken,
    clearAccessToken,
    getAccessToken,
} from "../utils/token";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;

    isLoading: boolean;
    isAuthChecked: boolean;

    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
    reset: () => void;
}

// Persisted slice
type PersistedState = Pick<AuthState, "user" | "isAuthenticated">;

// ─────────────────────────────────────────────
// In-flight hydration lock (IMPORTANT)
// ─────────────────────────────────────────────

let hydratePromise: Promise<void> | null = null;
let hydratedOnce = false;

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // ── State ─────────────────────────────
            user: null,
            isAuthenticated: false,

            isLoading: false,
            isAuthChecked: false,

            // ── LOGIN ─────────────────────────────
            login: async (credentials) => {
                set({ isLoading: true });

                try {
                    const res = await loginApi(credentials);

                    setAccessToken(res.accessToken);

                    set({
                        user: res.user,
                        isAuthenticated: true,
                        isAuthChecked: true,
                    });
                } finally {
                    set({ isLoading: false });
                }
            },

            // ── LOGOUT ────────────────────────────
            logout: async () => {
                try {
                    await logoutApi();
                } catch {
                    // ignore backend failure
                } finally {
                    clearAccessToken();

                    set({
                        user: null,
                        isAuthenticated: false,
                    });
                }
            },

            // ── HYDRATE (CORE AUTH BOOTSTRAP) ─────
            hydrate: async () => {
                const state = get();
                 if (hydratedOnce) return

                // already initialized
                if (state.isAuthChecked) return;
                // prevent Strict Mode + concurrent calls
                if (hydratePromise) return hydratePromise;

                hydratePromise = (async () => {
                    set({ isLoading: true });

                    try {
                        const token = getAccessToken();

                        // no token → unauthenticated session
                        if (!token) {
                            set({
                                user: null,
                                isAuthenticated: false,
                            });
                            return;
                        }

                        // validate session with backend
                        const user = await getMe();

                        set({
                            user,
                            isAuthenticated: true,
                        });
                    } catch {
                        clearAccessToken();

                        set({
                            user: null,
                            isAuthenticated: false,
                        });
                    } finally {
                        set({
                            isLoading: false,
                            isAuthChecked: true,
                        });

                        hydratePromise = null;
                    }
                })();

                hydratedOnce = true;
                return hydratePromise;
            },

            // ── RESET ──────────────────────────────
            reset: () => {
                clearAccessToken();

                set({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                    isAuthChecked: false,
                });
            },
        }),

        // ─────────────────────────────────────────
        // Persist config
        // ─────────────────────────────────────────
        {
            name: "auth-storage",

            partialize: (state: PersistedState) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        } as PersistOptions<AuthState, PersistedState>
    )
);

// ─────────────────────────────────────────────
// Selectors (prevents rerender storms)
// ─────────────────────────────────────────────

export const selectUser = (s: AuthState) => s.user;
export const selectIsAuthenticated = (s: AuthState) => s.isAuthenticated;
export const selectIsLoading = (s: AuthState) => s.isLoading;
export const selectIsAuthChecked = (s: AuthState) => s.isAuthChecked;