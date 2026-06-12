"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
    useAuthStore,
    selectUser,
    selectIsAuthChecked,
} from "@/features/auth/store/auth.store";

// Role → landing route. Mirrors the redirect in the login page.
const HOME_BY_ROLE: Record<string, string> = {
    ADMIN: "/dashboard/admin",
    CARE_AGENT: "/dashboard/care-agent",
    CLIENT: "/dashboard/client",
};

/**
 * /dashboard index — has no UI of its own. It forwards each user to the
 * dashboard for their role. AuthGuard sends authenticated users here from
 * public routes, so this must always route onward.
 */
export default function DashboardIndexPage() {
    const router = useRouter();
    const user = useAuthStore(selectUser);
    const isAuthChecked = useAuthStore(selectIsAuthChecked);

    useEffect(() => {
        if (!isAuthChecked) return;

        const target = user?.role
            ? HOME_BY_ROLE[user.role] ?? "/unauthorized"
            : "/login";

        router.replace(target);
    }, [isAuthChecked, user?.role, router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
    );
}
