"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import {
    useAuthStore,
    selectIsAuthenticated,
    selectIsAuthChecked,
} from "../store/auth.store";

// ─────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────

const PUBLIC_ROUTES = ["/login", "/register"];

// ─────────────────────────────────────────────────────
// AuthGuard
// ─────────────────────────────────────────────────────

interface AuthGuardProps {
    children: React.ReactNode;
}

/**
 * AuthGuard
 * - Protects private routes
 * - Redirects unauthenticated users → /login
 * - Redirects authenticated users away from auth pages
 * - Prevents UI flash during redirects
 */
export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isAuthChecked = useAuthStore(selectIsAuthChecked);

    // ─────────────────────────────────────────────────────
    // Route classification (more robust than exact match)
    // ─────────────────────────────────────────────────────

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
    );

    const isProtectedRoute = !isPublicRoute;

    // ─────────────────────────────────────────────────────
    // Redirect logic
    // ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!isAuthChecked) return;

        // Not logged in → protect private routes
        if (!isAuthenticated && isProtectedRoute) {
            if (pathname !== "/login") {
                router.replace("/login");
            }
            return;
        }

        // Logged in → prevent access to login/register
        if (isAuthenticated && isPublicRoute) {
            if (pathname !== "/dashboard") {
                router.replace("/dashboard");
            }
        }
    }, [
        isAuthChecked,
        isAuthenticated,
        isPublicRoute,
        isProtectedRoute,
        pathname,
        router,
    ]);

    // ─────────────────────────────────────────────────────
    // Safety rendering guards
    // ─────────────────────────────────────────────────────

    /**
     * Wait until auth state is fully resolved
     */
    if (!isAuthChecked) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    /**
     * Prevent flash of protected content during redirect
     */
    if (!isAuthenticated && isProtectedRoute) {
        return null;
    }

    return <>{children}</>;
}