// /app/admin/users/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getAllUsers, getUserStats } from "@/app/actions/adminActions";
import { AdminUserManagement } from "@/components/admin/AdminUserManagement";

export default async function AdminUsersPage() {
    const role = await getUserRole();

    if (role !== "ADMIN") {
        redirect("/");
    }

    const [users, stats] = await Promise.all([
        getAllUsers(),
        getUserStats(),
    ]);

    return <AdminUserManagement initialUsers={users} initialStats={stats} />;
}
