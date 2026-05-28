export default function AdminDashboardPage() {
    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 bg-white border rounded-xl shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Total Assignments</p>
                    <p className="text-2xl font-bold">24</p>
                </div>
                {/* Add more cards here later */}
            </div>
        </div>
    );
}