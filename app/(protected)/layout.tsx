"use client";

import { AuthProvider } from "@/features/auth/providers/auth-provider";
import { AuthGuard } from "@/features/auth/guards/auth-guard";

export default function ProtectedLayout({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    return (
        <AuthProvider>
            <AuthGuard>
            {children}
            </AuthGuard>
        </AuthProvider>
    );
}