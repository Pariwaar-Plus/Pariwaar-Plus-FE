"use client";

import { RoleGuard } from "@/features/auth/guards/role-guard";

export default function AdminSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RoleGuard allowedRoles={["ADMIN"]}>{children}</RoleGuard>;
}
