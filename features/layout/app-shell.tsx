"use client";

import Navbar from "@/components/shared/navbar";
import Sidebar from "@/components/shared/sidebar";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-950">
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN AREA */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* TOP NAVBAR */}
                <Navbar />

                {/* CONTENT */}
                <main className="flex-1 overflow-y-auto p-4">
                    {children}
                </main>
            </div>
        </div>
    );
}