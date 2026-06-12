"use client";

import { RoleGuard } from "@/features/auth/guards/role-guard";

export default function CareAgentSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RoleGuard allowedRoles={["CARE_AGENT"]}>{children}</RoleGuard>;
}
