"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

import { useMutation } from "@tanstack/react-query";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


import {
    ArrowRight,
    Eye,
    EyeOff,
    Lock
} from "lucide-react";

import { toast } from "sonner";



import { StaticSidebar } from "@/components/shared/side-bar-static/sidebar-static";
import { resetPassword, validateResetToken } from "@/features/auth/api/auth.api";

const schema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters"),

        confirmPassword: z.string(),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Passwords do not match",
        }
    );

type FormValues = z.infer<typeof schema>;
const inputClass = "pl-10 w-full h-full bg-white border-[1.5px] rounded-[10px] py-4 pr-4 pl-4 text-[0.95rem] font-['DM_Sans',sans-serif] text-(--text-dark) outline-none appearance-none transition-[border-color,box-shadow] duration-200 placeholder-[#BDB8B0] focus:border-(--green-light) focus:shadow-[0_0_0_3px_rgba(74,155,140,0.12)] disabled:opacity-[0.55] disabled:cursor-not-allowed"

export default function ResetPassword() {
    const router = useRouter();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const [tokenValid, setTokenValid] = useState<boolean | null>(null);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const validateMutation = useMutation({
        mutationFn: validateResetToken,

        onSuccess: () => {
            setTokenValid(true);
        },

        onError: () => {
            setTokenValid(false);
        },
    });

    const resetMutation = useMutation({
        mutationFn: resetPassword,

        onSuccess: () => {
            toast.success("Password updated successfully.");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        },

        onError: () => {
            toast.error("Unable to reset password.");
        },
    });

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            return;
        }

        validateMutation.mutate({
            token,
        });
    }, [token]);

    const onSubmit = (values: FormValues) => {
        if (!token) return;

        resetMutation.mutate({
            token,
            password: values.password,
        });
    };

    if (tokenValid === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Checking your reset link...
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6">

                <h1 className="text-3xl font-bold">
                    Reset Link Expired
                </h1>

                <p className="text-muted-foreground">
                    This password reset link is invalid or has expired.
                </p>

                <Link
                    href="/forgot-password"
                    className="w-2xs mt-6 bg-(--green-deep) text-white border-none rounded-[10px] py-3.5 px-4 text-[0.98rem] font-semibold font-['DM_Sans',sans-serif] cursor-pointer tracking-[0.01em] shadow-[0_4px_20px_rgba(26,60,52,0.25)] flex items-center justify-center gap-2.5 transition-[background,transform,box-shadow] duration-[200ms,150ms,200ms]"

                >
                    Request another reset link
                </Link>

                <Link
                    href="/login"
                    className="text-muted-foreground"
                >
                    Back to Login
                </Link>

            </div>
        );
    }

    return (
        <div className="min-h-screen grid md:grid-cols-2">

            <StaticSidebar />

            <div className="flex justify-center items-center">

                <div className="w-full max-w-md">

                    <h1 className="text-3xl font-bold mb-2">
                        Create New Password
                    </h1>

                    <p className="mb-8 text-muted-foreground">
                        Enter your new password below.
                    </p>

                    <Form {...form}>

                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (

                                    <FormItem>

                                        <FormLabel>Password</FormLabel>

                                        <FormControl>

                                            <div className="relative">

                                                <Lock className="h-4 w-4 absolute left-[0.95rem] top-1/2 -translate-y-1/2 pointer-events-none text-(--text-soft)" />


                                                <input
                                                    {...field}
                                                    className={inputClass}
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="enter your password"
                                                    autoComplete="current-password"
                                                    required
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowPassword((v) => !v)
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                >

                                                    {showPassword
                                                        ? <EyeOff className="h-5 w-5" />
                                                        : <Eye className="h-5 w-5" />
                                                    }

                                                </button>

                                            </div>

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

                                        <FormLabel>Confirm Password</FormLabel>

                                        <FormControl>

                                            <div className="relative">

                                                <Lock className="h-4 w-4 absolute left-[0.95rem] top-1/2 -translate-y-1/2 pointer-events-none text-(--text-soft)" />


                                                <input
                                                    {...field}
                                                    className={inputClass}
                                                    id="confirmPassword"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="enter your password"
                                                    autoComplete="current-password"
                                                    required
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword((v) => !v)
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                                >

                                                    {showConfirmPassword
                                                        ? <EyeOff className="h-5 w-5" />
                                                        : <Eye className="h-5 w-5" />
                                                    }

                                                </button>

                                            </div>

                                        </FormControl>

                                        <FormMessage />

                                    </FormItem>

                                )}
                            />

                            <button
                                type="submit"
                                className="w-full mt-6 bg-(--green-deep) text-white border-none rounded-[10px] py-3.5 px-4 text-[0.98rem] font-semibold font-['DM_Sans',sans-serif] cursor-pointer tracking-[0.01em] shadow-[0_4px_20px_rgba(26,60,52,0.25)] flex items-center justify-center gap-2.5 transition-[background,transform,box-shadow] duration-[200ms,150ms,200ms]"
                                disabled={resetMutation.isPending}
                            >
                                {resetMutation.isPending ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        Update Password
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                        </form>

                    </Form>

                </div>

            </div>

        </div>
    );
}