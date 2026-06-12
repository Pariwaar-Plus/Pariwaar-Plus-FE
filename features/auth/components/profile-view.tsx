"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { KeyRound, Mail, ShieldCheck, User as UserIcon } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAuthStore, selectUser } from "@/features/auth/store/auth.store";
import { changePassword } from "@/features/auth/api/auth.api";

const ROLE_LABEL: Record<string, string> = {
    ADMIN: "Administrator",
    CARE_AGENT: "Care Agent",
    CLIENT: "Client",
};

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    })
    .refine((d) => d.newPassword !== d.currentPassword, {
        message: "New password must be different from the current one",
        path: ["newPassword"],
    });

type PasswordFormValues = z.infer<typeof passwordSchema>;

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value?: string | null;
}) {
    return (
        <div className="flex items-center gap-3 border-b border-slate-50 py-3 last:border-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-800">{value ?? "—"}</p>
            </div>
        </div>
    );
}

export function ProfileView() {
    const user = useAuthStore(selectUser);

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const mutation = useMutation({
        mutationFn: (values: PasswordFormValues) =>
            changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            }),
        onSuccess: () => {
            toast.success("Password updated successfully");
            form.reset();
        },
        onError: (err: Error) => {
            toast.error(err.message || "Failed to update password");
        },
    });

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : user?.email?.slice(0, 2).toUpperCase() ?? "?";

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
                <p className="text-muted-foreground">
                    View your account and update your password.
                </p>
            </div>

            {/* Account card */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white">
                        {initials}
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-800">
                            {user?.name ?? "—"}
                        </p>
                        <span
                            className={cn(
                                "mt-1 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700"
                            )}
                        >
                            {user?.role ? ROLE_LABEL[user.role] ?? user.role : "—"}
                        </span>
                    </div>
                </div>

                <div className="mt-4 rounded-xl border px-4">
                    <InfoRow icon={UserIcon} label="Name" value={user?.name} />
                    <InfoRow icon={Mail} label="Email" value={user?.email} />
                    <InfoRow
                        icon={ShieldCheck}
                        label="Role"
                        value={user?.role ? ROLE_LABEL[user.role] ?? user.role : null}
                    />
                </div>
            </div>

            {/* Change password card */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Change Password</h3>
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="current-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending ? "Updating..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
