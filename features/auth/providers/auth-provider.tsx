"use client";

import { createContext, useContext, useEffect } from "react";
import { useAuthStore, selectIsAuthChecked } from "../store/auth.store";

// ─────────────────────────────────────────────
// Context (optional but clean for future RBAC)
// ─────────────────────────────────────────────

interface AuthContextValue {
    isReady: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthContext must be used inside AuthProvider");
    }
    return ctx;
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

interface AuthProviderProps {
    children: React.ReactNode;
    loadingFallback?: React.ReactNode;
}

export function AuthProvider({
    children,
    loadingFallback,
}: AuthProviderProps) {
    const hydrate = useAuthStore((s) => s.hydrate);
    const isAuthChecked = useAuthStore(selectIsAuthChecked);

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    // block UI until auth state is resolved
    if (!isAuthChecked) {
        return (
            <>
                {loadingFallback ?? <DefaultLoadingScreen />}
            </>
        );
    }

    return (
        <AuthContext.Provider value={{ isReady: true }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─────────────────────────────────────────────
// Default loading UI
// ─────────────────────────────────────────────

function DefaultLoadingScreen() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-gray-950">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

                <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Syncing session…
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Please wait
                    </p>
                </div>
            </div>
        </div>
    );
}