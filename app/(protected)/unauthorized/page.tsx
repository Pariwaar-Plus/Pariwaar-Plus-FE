"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { useAuthStore, selectUser } from "@/features/auth/store/auth.store";

// Where each role's home lives — used to send the user back somewhere valid.
const HOME_BY_ROLE: Record<string, string> = {
    ADMIN: "/dashboard/admin",
    CARE_AGENT: "/dashboard/care-agent",
    CLIENT: "/dashboard/client",
};

export default function UnauthorizedPage() {
    const router = useRouter();
    const user = useAuthStore(selectUser);

    const home = user?.role ? HOME_BY_ROLE[user.role] ?? "/dashboard" : "/dashboard";

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <ShieldAlert className="h-7 w-7 text-red-500" />
                </div>

                <h1 className="text-xl font-bold text-slate-900">Access denied</h1>
                <p className="mt-2 text-sm text-slate-500">
                    You don&apos;t have permission to view this page. If you think this
                    is a mistake, contact your administrator.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Go back
                    </button>
                    <Link
                        href={home}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
