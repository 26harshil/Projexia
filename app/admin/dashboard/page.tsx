// /app/admin/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { currentUser } from "@clerk/nextjs/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";

export default async function AdminDashboard() {
  const role = await getUserRole();
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (role && role !== "ADMIN") {
    redirect(`/${role.toLowerCase()}/dashboard`);
  }

  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Admin User";
  const userEmail = user.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader 
        userName={userName} 
        userEmail={userEmail} 
        role={role || "ADMIN"} 
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <AdminStatCard
            title="Total Users"
            value="0"
            iconName="Users"
            color="violet"
            description="Registered users"
            trend={{ value: "+0%", positive: true }}
            index={0}
          />
          <AdminStatCard
            title="Total Courses"
            value="0"
            iconName="BookOpen"
            color="blue"
            description="Active courses"
            trend={{ value: "+0%", positive: true }}
            index={1}
          />
          <AdminStatCard
            title="Active Projects"
            value="0"
            iconName="FolderKanban"
            color="emerald"
            description="Ongoing projects"
            index={2}
          />
          <AdminStatCard
            title="System Health"
            value="100%"
            iconName="Activity"
            color="amber"
            description="All systems operational"
            index={3}
          />
        </div>

        {/* Dashboard Content */}
        <AdminDashboardContent firstName={user.firstName || "Admin"} />
      </div>
    </div>
  );
}