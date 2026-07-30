"use client";

import { StaticSidebar } from "@/components/shared/side-bar-static/sidebar-static";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { forgotPassword } from "@/features/auth/api/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const inputClass = "pl-10 w-full h-full bg-white border-[1.5px] rounded-[10px] py-4 pr-4 pl-4 text-[0.95rem] font-['DM_Sans',sans-serif] text-(--text-dark) outline-none appearance-none transition-[border-color,box-shadow] duration-200 placeholder-[#BDB8B0] focus:border-(--green-light) focus:shadow-[0_0_0_3px_rgba(74,155,140,0.12)] disabled:opacity-[0.55] disabled:cursor-not-allowed"


const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {


    const form = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: () => {
            toast.success(
                "If an account exists, a password reset link has been sent."
            );
        },
        onError: () => {
            toast.error("Something went wrong.");
        },
    });
    const handleSubmit = (values: ForgotPasswordForm) => {
        forgotPasswordMutation.mutate(values);
    };
    return (
        <>
            <div className="min-h-screen grid md:grid-cols-2 bg-(--cream)">

                {/* ── LEFT PANEL ── */}
                <StaticSidebar />

                {/* ── RIGHT PANEL ── */}
                <div className="flex flex-col justify-start md:justify-center items-center px-6 py-10 md:px-8 md:py-12 bg-(--cream) relative">
                    <div
                        className="pointer-events-none absolute top-0 right-0 h-50 w-50"
                        style={{
                            background:
                                "radial-gradient(ellipse at top right, rgba(74,155,140,.08), transparent 70%)",
                        }}
                    />

                    <div className="w-full max-w-100 animate-fade-up">
                        {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-(--green-pale) px-3.5 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-(--green-deep)">
                            <span className="h-1.5 w-1.5 rounded-full bg-(--green-light) animate-pulse" />
                            Secure Portal
                        </div> */}

                        <h1 className="font-['Playfair_Display',serif] text-[2rem] font-bold leading-[1.2] text-(--green-deep) mb-[0.55rem]">Reset Your Password</h1>


                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-[0.45rem] mb-[1.1rem]">
                                            <FormLabel className="text-sm font-semibold text-(--text-mid) tracking-wide">
                                                Enter your email address
                                            </FormLabel>

                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-[0.95rem] top-1/2 h-4 w-4 -translate-y-1/2 text-(--text-soft) pointer-events-none" />

                                                    <input
                                                        {...field}
                                                        className={inputClass}
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        autoComplete="email"
                                                        // disabled={isLoading}
                                                        required
                                                    />
                                                </div>
                                            </FormControl>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />



                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-(--green-deep) text-white border-none rounded-[10px] py-3.5 px-4 text-[0.98rem] font-semibold font-['DM_Sans',sans-serif] cursor-pointer tracking-[0.01em] shadow-[0_4px_20px_rgba(26,60,52,0.25)] flex items-center justify-center gap-2.5 transition-[background,transform,box-shadow] duration-[200ms,150ms,200ms]"
                                    disabled={forgotPasswordMutation.isPending}
                                >
                                    {forgotPasswordMutation.isPending ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending Link..
                                        </>
                                    ) : (
                                        <>
                                            Send Reset Link
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </Form>
                        <div className="flex mt-4 items-center justify-center">
                            <ArrowLeft className="w-4 h-4" />
                            <p className=" ml-1 text-center text-sm text-(--text-soft)">
                                <Link href="/login">Back to sign in</Link>
                            </p>
                        </div>
                        <p className="text-center mt-4 text-sm text-(--text-soft)">
                            New to Pariwaar+?{" "}
                            <a href="#">Contact us to get started</a>
                        </p>
                    </div>
                </div>
            </div >
        </>
    );
}