"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --green-deep:  #1A3C34;
                    --green-mid:   #2D6A5F;
                    --green-light: #4A9B8C;
                    --green-pale:  #D4EDE8;
                    --green-mist:  #EBF6F4;
                    --saffron:     #E8861A;
                    --saffron-lt:  #F5A84B;
                    --cream:       #FAF7F2;
                    --text-dark:   #1C1C1C;
                    --text-mid:    #4A4A4A;
                    --text-soft:   #7A7A7A;
                    --border:      #E2DDD6;
                    --error:       #DC2626;
                }

                html, body { height: 100%; font-family: 'DM Sans', sans-serif; }

                .login-root {
                    min-height: 100vh;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    background: var(--cream);
                }

                /* ── LEFT PANEL ── */
                .left-panel {
                    background: var(--green-deep);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 3rem 3.5rem;
                    color: #fff;
                }

                /* Decorative orbs */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                }
                .orb-1 {
                    width: 420px; height: 420px;
                    top: -120px; right: -140px;
                    background: radial-gradient(circle, rgba(74,155,140,.35) 0%, transparent 70%);
                }
                .orb-2 {
                    width: 300px; height: 300px;
                    bottom: 60px; left: -80px;
                    background: radial-gradient(circle, rgba(232,134,26,.2) 0%, transparent 70%);
                }
                .orb-3 {
                    width: 180px; height: 180px;
                    top: 50%; left: 55%;
                    background: radial-gradient(circle, rgba(255,255,255,.04) 0%, transparent 70%);
                }

                /* Dot grid texture */
                .dot-grid {
                    position: absolute; inset: 0; z-index: 0;
                    background-image: radial-gradient(rgba(255,255,255,.06) 1px, transparent 1px);
                    background-size: 28px 28px;
                }

                .left-top { position: relative; z-index: 1; }

                .brand-mark {
                    display: flex; align-items: center; gap: .7rem;
                    text-decoration: none; margin-bottom: 3.5rem;
                }
                .brand-icon {
                    width: 40px; height: 40px; border-radius: 11px;
                    background: rgba(255,255,255,.12);
                    border: 1px solid rgba(255,255,255,.18);
                    display: flex; align-items: center; justify-content: center;
                    backdrop-filter: blur(6px);
                }
                .brand-icon svg { width: 22px; height: 22px; fill: #fff; }
                .brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem; font-weight: 700;
                    color: #fff; letter-spacing: -.02em;
                }
                .brand-name span { color: var(--saffron-lt); }

                .left-headline {
                    font-family: 'Playfair Display', serif;
                    font-size: clamp(2rem, 3vw, 2.8rem);
                    font-weight: 700; line-height: 1.18;
                    color: #fff; margin-bottom: 1.2rem;
                }
                .left-headline em {
                    font-style: italic;
                    color: var(--saffron-lt);
                }
                .left-sub {
                    font-size: .97rem; line-height: 1.75;
                    color: rgba(255,255,255,.62);
                    max-width: 340px;
                }

                /* Stat pills */
                .stat-row {
                    display: flex; flex-direction: column; gap: .85rem;
                    position: relative; z-index: 1;
                    margin-top: 3rem;
                }
                .stat-pill {
                    display: flex; align-items: center; gap: .9rem;
                    background: rgba(255,255,255,.07);
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 14px; padding: .85rem 1.1rem;
                    backdrop-filter: blur(8px);
                    animation: slideInLeft .5s ease both;
                }
                .stat-pill:nth-child(2) { animation-delay: .1s; }
                .stat-pill:nth-child(3) { animation-delay: .2s; }
                .stat-icon {
                    width: 38px; height: 38px; border-radius: 10px;
                    background: rgba(255,255,255,.1);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.1rem; flex-shrink: 0;
                }
                .stat-text strong {
                    display: block; font-size: .95rem;
                    font-weight: 600; color: #fff;
                }
                .stat-text span {
                    font-size: .78rem; color: rgba(255,255,255,.5);
                }

                .left-footer {
                    position: relative; z-index: 1;
                    font-size: .78rem; color: rgba(255,255,255,.35);
                    margin-top: 2rem;
                }

                /* ── RIGHT PANEL ── */
                .right-panel {
                    display: flex; flex-direction: column;
                    justify-content: center; align-items: center;
                    padding: 3rem 2rem;
                    background: var(--cream);
                    position: relative;
                }

                /* Subtle top-right deco */
                .right-deco {
                    position: absolute; top: 0; right: 0;
                    width: 200px; height: 200px;
                    background: radial-gradient(ellipse at top right, rgba(74,155,140,.08), transparent 70%);
                    pointer-events: none;
                }

                .form-shell {
                    width: 100%; max-width: 400px;
                    animation: fadeUp .6s ease both;
                }

                .form-eyebrow {
                    display: inline-flex; align-items: center; gap: .45rem;
                    background: var(--green-pale);
                    color: var(--green-deep);
                    font-size: .74rem; font-weight: 700;
                    letter-spacing: .08em; text-transform: uppercase;
                    padding: .32rem .85rem; border-radius: 999px;
                    margin-bottom: 1.6rem;
                }
                .eyebrow-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    background: var(--green-light);
                    animation: pulse 2s infinite;
                }

                .form-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem; font-weight: 700; line-height: 1.2;
                    color: var(--green-deep); margin-bottom: .55rem;
                }
                .form-desc {
                    font-size: .9rem; color: var(--text-soft);
                    margin-bottom: 2.2rem; line-height: 1.6;
                }

                /* ── INPUTS ── */
                .field { display: flex; flex-direction: column; gap: .45rem; margin-bottom: 1.1rem; }
                .field-label {
                    font-size: .8rem; font-weight: 600;
                    color: var(--text-mid); letter-spacing: .02em;
                }
                .input-wrap { position: relative; }
                .input-icon {
                    position: absolute; left: .95rem; top: 50%; transform: translateY(-50%);
                    color: var(--text-soft); pointer-events: none;
                    display: flex; align-items: center;
                }
                .input-icon svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.8; }

                .field input {
                    width: 100%;
                    background: #fff;
                    border: 1.5px solid var(--border);
                    border-radius: 10px;
                    padding: .78rem 1rem .78rem 2.65rem;
                    font-size: .95rem; font-family: 'DM Sans', sans-serif;
                    color: var(--text-dark);
                    outline: none;
                    transition: border-color .2s, box-shadow .2s;
                    -webkit-appearance: none;
                }
                .field input::placeholder { color: #BDB8B0; }
                .field input:focus {
                    border-color: var(--green-light);
                    box-shadow: 0 0 0 3px rgba(74,155,140,.12);
                }
                .field input:disabled { opacity: .55; cursor: not-allowed; }

                /* password toggle */
                .pw-toggle {
                    position: absolute; right: .9rem; top: 50%; transform: translateY(-50%);
                    background: none; border: none; cursor: pointer;
                    color: var(--text-soft); padding: .2rem;
                    display: flex; align-items: center;
                    transition: color .2s;
                }
                .pw-toggle:hover { color: var(--green-deep); }
                .pw-toggle svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 1.8; }

                .field-row {
                    display: flex; justify-content: space-between; align-items: center;
                }
                .forgot-link {
                    font-size: .8rem; color: var(--green-mid);
                    text-decoration: none; font-weight: 500;
                    transition: color .2s;
                }
                .forgot-link:hover { color: var(--green-deep); }

                /* ── SUBMIT ── */
                .submit-btn {
                    width: 100%; margin-top: 1.6rem;
                    background: var(--green-deep); color: #fff;
                    border: none; border-radius: 10px;
                    padding: .9rem 1rem;
                    font-size: .98rem; font-weight: 600;
                    font-family: 'DM Sans', sans-serif;
                    cursor: pointer; letter-spacing: .01em;
                    box-shadow: 0 4px 20px rgba(26,60,52,.25);
                    transition: background .2s, transform .15s, box-shadow .2s;
                    display: flex; align-items: center; justify-content: center; gap: .6rem;
                }
                .submit-btn:hover:not(:disabled) {
                    background: var(--green-mid);
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(26,60,52,.3);
                }
                .submit-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }

                /* spinner */
                .spinner {
                    width: 17px; height: 17px;
                    border: 2.5px solid rgba(255,255,255,.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin .75s linear infinite;
                }

                /* divider */
                .divider {
                    display: flex; align-items: center; gap: 1rem;
                    margin: 1.6rem 0; color: var(--text-soft);
                    font-size: .78rem;
                }
                .divider::before, .divider::after {
                    content: ''; flex: 1;
                    height: 1px; background: var(--border);
                }

                /* trust badges */
                .trust-row {
                    display: flex; align-items: center; justify-content: center;
                    gap: 1.4rem; margin-top: 1.8rem;
                }
                .trust-item {
                    display: flex; align-items: center; gap: .4rem;
                    font-size: .75rem; color: var(--text-soft);
                }
                .trust-item svg { width: 14px; height: 14px; stroke: var(--green-light); fill: none; stroke-width: 2; }

                /* bottom link */
                .bottom-link {
                    text-align: center; margin-top: 2rem;
                    font-size: .85rem; color: var(--text-soft);
                }
                .bottom-link a { color: var(--green-mid); font-weight: 600; text-decoration: none; }
                .bottom-link a:hover { color: var(--green-deep); }

                /* ── ANIMATIONS ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-16px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: .5; transform: scale(.75); }
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 820px) {
                    .login-root { grid-template-columns: 1fr; }
                    .left-panel { display: none; }
                    .right-panel { padding: 2.5rem 1.5rem; justify-content: flex-start; padding-top: 4rem; }
                }
            `}</style>

            <div className="login-root">

                {/* ── LEFT PANEL ── */}
                <div className="left-panel">
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />
                    <div className="dot-grid" />

                    <div className="left-top">
                        <Link href="/" className="brand-mark">
                            <div className="brand-icon">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 21C12 21 3 14.5 3 8.5C3 5.46 5.46 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.54 3 23 5.46 23 8.5C23 14.5 12 21 12 21Z" opacity=".4"/>
                                    <path d="M9 11H11V9H13V11H15V13H13V15H11V13H9V11Z"/>
                                </svg>
                            </div>
                            <span className="brand-name">Pariwaar<span>+</span></span>
                        </Link>

                        <h2 className="left-headline">
                            Care that travels<br />
                            <em>every distance.</em>
                        </h2>
                        <p className="left-sub">
                            Connecting Nepali families abroad with real-time health monitoring, companion visits, and peace of mind — for आमाबुवा back home.
                        </p>

                        <div className="stat-row">
                            <div className="stat-pill">
                                <div className="stat-icon">👨‍👩‍👧‍👦</div>
                                <div className="stat-text">
                                    <strong>2,400+ NRN Families</strong>
                                    <span>Across 18 countries worldwide</span>
                                </div>
                            </div>
                            <div className="stat-pill">
                                <div className="stat-icon">🏥</div>
                                <div className="stat-text">
                                    <strong>14 Cities in Nepal</strong>
                                    <span>With trained care companions</span>
                                </div>
                            </div>
                            <div className="stat-pill">
                                <div className="stat-icon">⚡</div>
                                <div className="stat-text">
                                    <strong>24/7 Emergency Response</strong>
                                    <span>Average 8-minute dispatch time</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="left-footer">
                        © 2025 Pariwaar Plus Pvt. Ltd. · Registered in Nepal 🇳🇵
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="right-panel">
                    <div className="right-deco" />

                    <div className="form-shell">
                        <div className="form-eyebrow">
                            <span className="eyebrow-dot" />
                            Secure Portal
                        </div>

                        <h1 className="form-title">Welcome back</h1>
                        <p className="form-desc">
                            Sign in to check on your family's wellbeing.
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Email */}
                            <div className="field">
                                <label className="field-label" htmlFor="email">Email Address</label>
                                <div className="input-wrap">
                                    <span className="input-icon">
                                        <svg viewBox="0 0 24 24">
                                            <rect x="2" y="4" width="20" height="16" rx="2"/>
                                            <polyline points="2,4 12,13 22,4"/>
                                        </svg>
                                    </span>
                                    <input
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
                            <div className="field">
                                <div className="field-row">
                                    <label className="field-label" htmlFor="password">Password</label>
                                    <a href="#" className="forgot-link">Forgot password?</a>
                                </div>
                                <div className="input-wrap">
                                    <span className="input-icon">
                                        <svg viewBox="0 0 24 24">
                                            <rect x="3" y="11" width="18" height="11" rx="2"/>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input
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
                                        className="pw-toggle"
                                        onClick={() => setShowPassword((v) => !v)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isLoading || !email || !password}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner" />
                                        Signing in…
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                            <line x1="5" y1="12" x2="19" y2="12"/>
                                            <polyline points="12,5 19,12 12,19"/>
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                        <p className="bottom-link">
                            New to Pariwaar+?{" "}
                            <a href="#">Contact us to get started</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}