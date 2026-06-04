import Sidebar from "@/components/shared/sidebar";
import Navbar from "@/components/shared/navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* 1. Sidebar: Fixed to the left */}
            <Sidebar className="hidden md:flex w-64 flex-col fixed inset-y-0 z-80 bg-gray-900" />
            
            {/* 2. Main Content Area */}
            <div className="md:pl-64 flex flex-col w-full h-full">
            {/* 3. Navbar: Top navigation */}
            <Navbar />
            
            {/* 4. Page Content: Where the Admin/Agent pages appear */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
            </div>
        </div>
    );
}