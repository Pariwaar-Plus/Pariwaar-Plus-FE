"use client";

import { RouteMetaData } from "@/app/(protected)/dashboard/layout";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const MobileNavBar = ({ routes }: { routes: RouteMetaData[] }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>

            {/* Mobile hamburger */}
            <button
                type="button"
                onClick={() => {console.log("Asdf");setMenuOpen(!menuOpen)}}
                className=" md:hidden fixed top-18 left-2 z-50 flex h-6 w-6 items-center justify-center rounded-lg text-white"
                aria-label="Menu"
                aria-expanded={menuOpen}
            >
                <div className="flex flex-col gap-1">
                    <span
                        className={cn(
                            "block h-0.5 w-5 transition-transform bg-(--green-deep) rounded-xs",
                            menuOpen && "translate-y-2 rotate-45"
                        )}
                    />
                    <span
                        className={cn(
                           "block h-0.5 w-5 transition-transform bg-(--green-deep) rounded-xs",
                            menuOpen && "opacity-0"
                        )}
                    />
                    <span
                        className={cn(
                            "block h-0.5 w-5 transition-transform bg-(--green-deep) rounded-xs",
                            menuOpen && "-translate-y-2 -rotate-45"
                        )}
                    />
                </div>
            </button>

            {/* Mobile menu */}
            {menuOpen && (
                <nav className="md:hidden fixed inset-x-0 top-0 z-40 bg-slate-950 px-4 pb-4 pt-20 shadow-xl">
                    <div className="space-y-1">
                        {routes.map((route) => {
                            const isActive = pathname === route.href;
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-white/10 text-white"
                                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                    )}
                                >
                                    <route.icon
                                        size={18}
                                        className={cn(
                                            "shrink-0",
                                            isActive
                                                ? route.activeColor ?? "text-white"
                                                : route.color ?? "text-slate-500"
                                        )}
                                    />

                                    <span>{route.label}</span>

                                    {isActive && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/40" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>
            )}
        </>
    )
}