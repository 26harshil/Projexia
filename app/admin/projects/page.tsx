// /app/admin/projects/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getAllProjectGroups, getProjectStats } from "@/app/actions/adminActions";
import { AdminProjectsContent } from "@/components/admin/AdminProjectsContent";

export default async function ProjectsPage() {
    const role = await getUserRole();

    if (role !== "ADMIN") {
        redirect("/");
    }

    const [projects, stats] = await Promise.all([
        getAllProjectGroups(),
        getProjectStats(),
    ]);

    return <AdminProjectsContent initialProjects={projects} initialStats={stats} />;
}
