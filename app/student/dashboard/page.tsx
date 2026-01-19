// /app/student/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default async function StudentDashboard() {
  const role = await getUserRole();
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  if (role && role !== "STUDENT") {
    redirect(`/${role.toLowerCase()}/dashboard`);
  }

  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
  const userEmail = user.emailAddresses[0]?.emailAddress || "";

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative z-10">
        <DashboardHeader 
          userName={userName} 
          userEmail={userEmail} 
          role={role || "STUDENT"} 
        />

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard
              title="Enrolled Projects"
              value="0"
              iconName="FolderKanban"
              gradient="from-green-500 to-cyan-600"
              description="Active projects"
              index={0}
            />
            <StatCard
              title="Progress"
              value="0%"
              iconName="TrendingUp"
              gradient="from-blue-500 to-purple-600"
              description="Overall completion"
              index={1}
            />
            <StatCard
              title="Upcoming Meetings"
              value="0"
              iconName="Calendar"
              gradient="from-purple-500 to-pink-600"
              description="This week"
              index={2}
            />
            <StatCard
              title="Announcements"
              value="0"
              iconName="Bell"
              gradient="from-orange-500 to-red-600"
              description="Unread messages"
              index={3}
            />
          </div>

          {/* Dashboard Content */}
          <DashboardContent firstName={user.firstName || "Student"} />
        </div>
      </div>
    </div>
  );
}