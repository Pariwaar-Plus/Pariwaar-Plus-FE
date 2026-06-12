"use client";

import { RoleGuard } from "@/features/auth/guards/role-guard";

export default function ClientSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RoleGuard allowedRoles={["CLIENT"]}>{children}</RoleGuard>;
}
