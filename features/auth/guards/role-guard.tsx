"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
    useAuthStore,
    selectIsAuthenticated,
    selectUser,
    selectIsAuthChecked,
} from "../store/auth.store";

// ─────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────

export type Role = "ADMIN" | "CARE_AGENT" | "CLIENT";

// ─────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────

interface RoleGuardProps {
    children: React.ReactNode;

    /**
     * Allowed roles for this route
     */
    allowedRoles: Role[];

    /**
     * Optional redirect if unauthorized
     */
    redirectTo?: string;
}

/**
 * RoleGuard (RBAC Layer)
 *
 * Use AFTER AuthGuard
 *
 * Example:
 * <RoleGuard allowedRoles={["ADMIN"]}>
 *     <AdminDashboard />
 * </RoleGuard>
 */
export function RoleGuard({
    children,
    allowedRoles,
    redirectTo = "/unauthorized",
}: RoleGuardProps) {
    const router = useRouter();

    const user = useAuthStore(selectUser);
    const isAuthenticated = useAuthStore(selectIsAuthenticated);
    const isAuthChecked = useAuthStore(selectIsAuthChecked);

    const userRole = user?.role as Role | undefined;

    // ─────────────────────────────────────────────────────
    // Authorization logic
    // ─────────────────────────────────────────────────────

    useEffect(() => {
        if (!isAuthChecked) return;
        if (!isAuthenticated) return;

        // No role → deny access
        if (!userRole) {
            router.replace(redirectTo);
            return;
        }

        // Role not allowed → redirect
        if (!allowedRoles.includes(userRole)) {
            router.replace(redirectTo);
        }
    }, [
        isAuthChecked,
        isAuthenticated,
        userRole,
        allowedRoles,
        redirectTo,
        router,
    ]);

    // ─────────────────────────────────────────────────────
    // Safety render blocking
    // ─────────────────────────────────────────────────────

    if (!isAuthChecked) return null;
    if (!isAuthenticated) return null;

    if (!userRole) return null;
    if (!allowedRoles.includes(userRole)) return null;

    return <>{children}</>;
}