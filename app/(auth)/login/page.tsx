"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const login = useAuthStore((s) => s.login);
    const isLoading = useAuthStore((s) => s.isLoading);
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            await login({ email, password });
            const user = useAuthStore.getState().user;
            console.log(user)
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

    const stats = [{
        icon: "👨‍👩‍👧‍👦",
        description: "2,400+ NRN Families",
        span: "Across 18 countries worldwide"
    },
    {
        icon: "🏥",
        description: "14 Cities in Nepal",
        span: "With trained care companions"
    },
    {
        icon: "⚡",
        description: "24/7 Emergency Response",
        span: "Average 8-minute dispatch time"
    }]

    return (
        <>
            <div className="min-h-screen grid md:grid-cols-2 bg-(--cream)">

                {/* ── LEFT PANEL ── */}
                <div className="hidden md:flex flex-col justify-between relative overflow-hidden bg-(--green-deep) text-white px-14 py-12">
                    <div className="absolute -top-32 -right-36 h-105 w-105 rounded-full bg-[radial-gradient(circle,rgba(74,155,140,.35)_0%,transparent_70%)]" />

                    <div className="absolute bottom-16 -left-20 h-75 w-75 rounded-full bg-[radial-gradient(circle,rgba(232,134,26,.2)_0%,transparent_70%)]" />

                    <div className="absolute left-[55%] top-1/2 h-45 w-45 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.04)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[28px_28px]"></div>
                    <div className="relative z-1">
                        <Link
                            href="/"
                            className="mb-14 flex items-center gap-3"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-white/18 bg-white/12 backdrop-blur-[6px]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-[11px] border border-white/18 bg-white/12 backdrop-blur-[6px]">
                                    <svg className="h-5.5 w-5.5 fill-white" viewBox="0 0 24 24">
                                        <path d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z" opacity=".4" />
                                        <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z" />
                                    </svg>
                                </div>

                            </div>
                            <span className="font-['Playfair_Display',serif] text-[1.5rem] font-bold text-white tracking-[-0.02em]">Pariwaar<span> +</span></span>
                        </Link>

                        <h2 className="font-['Playfair_Display',serif] text-[clamp(2rem,3vw,2.8rem)] font-bold leading-[1.18] text-white mb-[1.2rem]">
                            Care that travels<br />
                            <em>every distance.</em>
                        </h2>
                        <p className="text-[0.97rem] leading-[1.75] text-white/62 max-w-85">
                            Connecting Nepali families abroad with real-time health monitoring, companion visits, and peace of mind — for आमाबुवा back home.
                        </p>

                        <div className="relative z-10 flex flex-col gap-[0.85rem] mt-12">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex items-center gap-[0.9rem] bg-white/[0.07] border border-white/10 rounded-[14px] px-[1.1rem] py-[0.85rem] backdrop-blur-sm animate-[slideInLeft_0.5s_ease_both]">
                                    <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-[1.1rem]">{stat.icon}</div>
                                    <div className="block text-[0.95rem] font-semibold text-white">
                                        <strong>{stat.description}</strong>
                                        <span> {stat.span}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 text-[0.78rem] text-white/35 mt-8">
                        © 2025 Pariwaar Plus Pvt. Ltd. · Registered in Nepal 🇳🇵
                    </div>
                </div>

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
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-(--green-pale) px-3.5 py-1.5 text-[0.74rem] font-bold uppercase tracking-[0.08em] text-(--green-deep)">
                            <span className="h-1.5 w-1.5 rounded-full bg-(--green-light) animate-pulse" />
                            Secure Portal
                        </div>

                        <h1 className="font-['Playfair_Display',serif] text-[2rem] font-bold leading-[1.2] text-(--green-deep) mb-[0.55rem]">Welcome back</h1>
                        <p className="text-[0.9rem] text-(--text-soft) leading-[1.6] mb-[2.2rem]">
                            Sign in to check on your family's wellbeing.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="flex flex-col gap-[0.45rem] mb-[1.1rem]">
                                <label className="text-sm font-semibold text-(--text-mid) tracking-wide" htmlFor="email">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-[0.95rem] top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-(--text-soft)">
                                        <svg viewBox="0 0 24 24">
                                            <rect x="2" y="4" width="20" height="16" rx="2" />
                                            <polyline points="2,4 12,13 22,4" />
                                        </svg>
                                    </span>
                                    <input
                                        className="w-full bg-white border-[1.5px] rounded-[10px] py-4 pr-4 pl-4 text-[0.95rem] font-['DM_Sans',sans-serif] text-(--text-dark) outline-none appearance-none transition-[border-color,box-shadow] duration-200 placeholder-[#BDB8B0] focus:border-(--green-light) focus:shadow-[0_0_0_3px_rgba(74,155,140,0.12)] disabled:opacity-[0.55] disabled:cursor-not-allowed"
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-(--text-mid) tracking-wide" htmlFor="password">Password</label>
                                    <a href="#" className="text-[0.8rem] text-(--green-mid) no-underline font-medium transition-colors duration-200 hover:text-(--green-deep)">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-[0.95rem] top-1/2 -translate-y-1/2 text-(--text-soft) pointer-events-none flex items-center">
                                        <svg viewBox="0 0 24 24">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    </span>
                                    <input
                                        className="w-full bg-white border-[1.5px] rounded-[10px] py-4 pr-4 pl-4 text-[0.95rem] font-['DM_Sans',sans-serif] text-(--text-dark) outline-none appearance-none transition-[border-color,box-shadow] duration-200 placeholder-[#BDB8B0] focus:border-(--green-light) focus:shadow-[0_0_0_3px_rgba(74,155,140,0.12)] disabled:opacity-[0.55] disabled:cursor-not-allowed"
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer flex items-center p-1 text-(--text-soft) transition-colors duration-200"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-6 h-6" />
                                        ) : (
                                            <Eye className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-(--green-deep) text-white border-none rounded-[10px] py-3.5 px-4 text-[0.98rem] font-semibold font-['DM_Sans',sans-serif] cursor-pointer tracking-[0.01em] shadow-[0_4px_20px_rgba(26,60,52,0.25)] flex items-center justify-center gap-2.5 transition-[background,transform,box-shadow] duration-[200ms,150ms,200ms]"
                                disabled={isLoading || !email || !password}
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