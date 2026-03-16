// /app/admin/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { currentUser } from "@clerk/nextjs/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { getUserStats, getProjectStats, getStudentStats } from "@/app/actions/adminActions";

export default async function AdminDashboard() {
  const role = await getUserRole();
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (role && role !== "ADMIN") {
    redirect(`/${role.toLowerCase()}/dashboard`);
  }

  // Fetch real stats from the database
  let stats = { totalUsers: 0, adminCount: 0, facultyCount: 0, studentCount: 0, activeCount: 0, inactiveCount: 0 };
  let projStats = { totalProjects: 0, totalProjectTypes: 0, totalMembers: 0, totalMeetings: 0 };
  let stuStats = { totalStudents: 0, activeStudents: 0, inactiveStudents: 0, studentsInGroups: 0 };

  try {
    [stats, projStats, stuStats] = await Promise.all([
      getUserStats(),
      getProjectStats(),
      getStudentStats(),
    ]);
  } catch (e) {
    // Fallback to zeros if stats fetch fails
  }

  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Admin User";
  const userEmail = user.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="min-h-screen bg-[#050A14]">
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
            value={String(stats.totalUsers)}
            iconName="Users"
            color="emerald"
            description="Registered users"
            trend={{ value: `${stats.activeCount} active`, positive: true }}
            index={0}
          />
          <AdminStatCard
            title="Students"
            value={String(stats.studentCount)}
            iconName="BookOpen"
            color="blue"
            description="Student accounts"
            index={1}
          />
          <AdminStatCard
            title="Faculty"
            value={String(stats.facultyCount)}
            iconName="FolderKanban"
            color="emerald"
            description="Faculty members"
            index={2}
          />
          <AdminStatCard
            title="Admins"
            value={String(stats.adminCount)}
            iconName="Activity"
            color="amber"
            description="Admin accounts"
            index={3}
          />
        </div>

        {/* Dashboard Content - Now with real data */}
        <AdminDashboardContent
          firstName={user.firstName || "Admin"}
          stats={stats}
          projectStats={projStats}
          studentStats={stuStats}
        />
      </div>
    </div>
  );
}