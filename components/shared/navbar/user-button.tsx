"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, User, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore, selectUser } from "@/features/auth/store/auth.store";
import { cn } from "@/lib/utils";

const ROLE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
    ADMIN: {
        label: "Administrator",
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-100 dark:bg-violet-900/30",
    },
    CARE_AGENT: {
        label: "Care Agent",
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    CLIENT: {
        label: "Client",
        color: "text-sky-600 dark:text-sky-400",
        bg: "bg-sky-100 dark:bg-sky-900/30",
    },
};

const AVATAR_BG: Record<string, string> = {
    ADMIN: "bg-violet-600",
    CARE_AGENT: "bg-emerald-600",
    CLIENT: "bg-sky-600",
};


export function UserButton() {
    const router = useRouter();
    const user = useAuthStore(selectUser);
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = async () => {
        await logout();
        router.replace("/login");
    };

    if (!user) return null;

    const initials = user.name
        ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase();

    const role = user.role as keyof typeof ROLE_STYLE | undefined;
    const roleStyle = role ? ROLE_STYLE[role] : null;
    const avatarBg = role ? (AVATAR_BG[role] ?? "bg-slate-600") : "bg-slate-600";
    const displayName = user.name || user.email;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors outline-none group">
                    <Avatar className="h-7 w-7 shrink-0">
                        <AvatarImage src="" alt={displayName} />
                        <AvatarFallback className={cn("text-white text-[11px] font-bold", avatarBg)}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-22.5 truncate">
                        {user.name?.split(" ")[0] ?? "Account"}
                    </span>
                    <ChevronDown className="hidden md:block w-3 h-3 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-64 p-0 overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl"
                align="end"
                sideOffset={8}
                forceMount
            >
                {/* ── Header ── */}
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                                <AvatarImage src="" alt={displayName} />
                                <AvatarFallback className={cn("text-white text-sm font-bold", avatarBg)}>
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate leading-tight">
                                    {displayName}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {user.email}
                                </p>
                                {roleStyle && (
                                    <span className={cn(
                                        "inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                                        roleStyle.bg, roleStyle.color
                                    )}>
                                        {roleStyle.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </DropdownMenuLabel>

                {/* ── Actions ── */}
                <div className="py-1.5">
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="mx-1.5 rounded-lg cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800"
                            onClick={() => router.push("/dashboard/profile")}
                        >
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <User className="h-3.5 w-3.5 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-medium text-[13px] leading-tight">Profile</p>
                                <p className="text-[10px] text-slate-400">View & edit your profile</p>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className="mx-1.5 rounded-lg cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800"
                            onClick={() => router.push("/dashboard/profile")}
                        >
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                <Settings className="h-3.5 w-3.5 text-slate-500" />
                            </div>
                            <div>
                                <p className="font-medium text-[13px] leading-tight">Settings</p>
                                <p className="text-[10px] text-slate-400">Preferences & account</p>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="my-1.5 mx-3 bg-slate-100 dark:bg-slate-800" />

                    <DropdownMenuSeparator className="my-1.5 mx-3 bg-slate-100 dark:bg-slate-800" />

                    {/* Logout */}
                    <DropdownMenuItem
                        className="mx-1.5 mb-1 rounded-lg cursor-pointer flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600"
                        onClick={handleLogout}
                    >
                        <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                            <LogOut className="h-3.5 w-3.5 text-red-500" />
                        </div>
                        <div>
                            <p className="font-medium text-[13px] leading-tight">Sign out</p>
                            <p className="text-[10px] text-red-400">End your current session</p>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}