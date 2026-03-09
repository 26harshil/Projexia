// /app/faculty/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { currentUser } from "@clerk/nextjs/server";
import { FacultyHeader } from "@/components/faculty/FacultyHeader";
import { FacultyStatCard } from "@/components/faculty/FacultyStatCard";
import { FacultyDashboardContent } from "@/components/faculty/FacultyDashboardContent";
import { getFacultyDashboardStats } from "@/app/actions/getFacultyRole";

export default async function FacultyDashboard() {
  const role = await getUserRole();
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (role && role !== "FACULTY") {
    redirect(`/${role.toLowerCase()}/dashboard`);
  }

  const stats = await getFacultyDashboardStats();

  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Faculty Member";
  const userEmail = user.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="min-h-screen bg-slate-50">
      <FacultyHeader
        userName={userName}
        userEmail={userEmail}
        role={role || "FACULTY"}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <FacultyStatCard
            title="Project Types"
            value={stats?.projectTypesCount?.toString() ?? "0"}
            iconName="BookOpen"
            color="emerald"
            description={`${stats?.studentGroups ?? 0} active groups`}
            index={0}
          />

          <FacultyStatCard
            title="Student Groups"
            value={stats?.studentGroups?.toString() ?? "0"}
            iconName="Users"
            color="amber"
            description={`${stats?.totalStudents ?? 0} total students`}
            index={1}
          />

          <FacultyStatCard
            title="Upcoming Meetings"
            value={stats?.upcomingMeetings?.toString() ?? "0"}
            iconName="Calendar"
            color="emerald"
            description={`${stats?.thisWeekMeetings ?? 0} this week`}
            index={2}
          />

          <FacultyStatCard
            title="Pending Reviews"
            value={stats?.pendingReviews?.toString() ?? "0"}
            iconName="ClipboardCheck"
            color="amber"
            description={`${stats?.completedMeetings ?? 0} completed`}
            index={3}
          />
        </div>

        {/* Dashboard Content */}
        <FacultyDashboardContent
          firstName={user.firstName || "Professor"}
          stats={stats}
        />
      </div>
    </div>
  );
}
