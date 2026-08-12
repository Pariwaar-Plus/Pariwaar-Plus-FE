"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { StaticSidebar } from "@/components/shared/side-bar-static/sidebar-static";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const inputClass = "pl-10 w-full h-full bg-white border-[1.5px] rounded-[10px] py-4 pr-4 pl-4 text-[0.95rem] font-['DM_Sans',sans-serif] text-(--text-dark) outline-none appearance-none transition-[border-color,box-shadow] duration-200 placeholder-[#BDB8B0] focus:border-(--green-light) focus:shadow-[0_0_0_3px_rgba(74,155,140,0.12)] disabled:opacity-[0.55] disabled:cursor-not-allowed"

const LoginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type loginFormValue = z.infer<typeof LoginSchema>

export default function LoginPage() {
    const login = useAuthStore((s) => s.login);
    const isLoading = useAuthStore((s) => s.isLoading);
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (values: loginFormValue) => {
        try {
            await login({ email: values.email, password: values.password });
            const user = useAuthStore.getState().user;
            if (!user) throw new Error("User not found");
            toast.success(`Welcome back, ${user.name || 'User'}!`);

            // Role based routing
            switch (user.role) {
                case "ADMIN":
                    router.push("/dashboard/admin");
                    break;
                case "CARE_AGENT":
                    router.push("/dashboard/care-agent");
                    break;
                case "CLIENT":
                    router.push("/dashboard/client");
                    break;
                default:
                    router.push("/login"); // Fallback
                    break;
            }
        } catch {
            toast.error("Invalid email or password. Please try again.");
        }
    };
    const form = useForm<loginFormValue>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


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
                        <a href="/" className="flex items-center gap-1 no-underline mb-4 md:hidden">
                            <div className="w-7 h-7 bg-(--green-deep) rounded-md flex items-center justify-center">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-white">
                                    <path d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z" opacity=".3" />
                                    <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z" />
                                </svg>
                            </div>
                            <span className="font-['Playfair_Display'] text-[1.45rem] font-bold text-(--green-deep) tracking-[-0.02em]">Pariwaar<span className="text-(--saffron)">+</span></span>
                        </a>
                      

                        <h1 className="font-['Playfair_Display',serif] text-[2rem] font-bold leading-[1.2] text-(--green-deep) mb-[0.55rem]">Welcome back</h1>
                        <p className="text-[0.9rem] text-(--text-soft) leading-[1.6] mb-[2.2rem]">
                            Sign in to check on your family's wellbeing.
                        </p>

                        <Form {...form} >


                            <form id='login-form' onSubmit={form.handleSubmit(handleSubmit)}>

                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-[0.45rem] mb-[1.1rem]">
                                            <FormLabel className="text-sm font-semibold text-(--text-mid) tracking-wide">Email Address</FormLabel>
                                            <FormControl >
                                                <div className="relative">
                                                    <Mail className="h-4 w-4 absolute left-[0.95rem] top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-(--text-soft)" />
                                                    <input
                                                        {...field}
                                                        className={inputClass}
                                                        id="email"
                                                        type="email"
                                                        placeholder="you@example.com"
                                                        autoComplete="email"
                                                        disabled={isLoading}
                                                        required
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />


                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-2 mb-4">
                                            <div className="flex items-center justify-between">
                                                <FormLabel className="text-sm font-semibold text-(--text-mid) tracking-wide">
                                                    Password
                                                </FormLabel>

                                                <Link
                                                    href="/forgot-password"
                                                    className="text-[0.8rem] text-(--green-mid) no-underline font-medium transition-colors duration-200 hover:text-(--green-deep)"
                                                >
                                                    Forgot password?
                                                </Link>
                                            </div>

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
                                                        disabled={isLoading}
                                                        required
                                                    />


                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword((v) => !v)}
                                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center p-1 text-(--text-soft)"
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-5 w-5" />
                                                        ) : (
                                                            <Eye className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>

                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />


                          

                                <button
                                    type="submit"
                                    form="login-form"
                                    className="w-full mt-6 bg-(--green-deep) text-white border-none rounded-[10px] py-3.5 px-4 text-[0.98rem] font-semibold font-['DM_Sans',sans-serif] cursor-pointer tracking-[0.01em] shadow-[0_4px_20px_rgba(26,60,52,0.25)] flex items-center justify-center gap-2.5 transition-[background,transform,box-shadow] duration-[200ms,150ms,200ms]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Signing in…
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </Form>
                        <p className="text-center mt-8 text-sm text-(--text-soft)">
                            New to Pariwaar+?{" "}
                            <a href="#">Contact us to get started</a>
                        </p>
                    </div>
                </div>
            </div >
        </>
    );
}