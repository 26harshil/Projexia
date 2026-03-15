// /app/student/dashboard/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StudentDashboardContent } from "@/components/student/StudentDashboardContent";
import { prisma } from "@/lib/prisma";



export default async function StudentDashboard() {

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const role = await getUserRole();

  if (role && role !== "STUDENT") {
    redirect(`/${role.toLowerCase()}/dashboard`);
  }

  // Extract user display i+989nfo from Clerk
  const userName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
  const userEmail = user.emailAddresses[0]?.emailAddress || "";


  const student = await prisma.student.findFirst({
    where: {
      users: {
        clerkid: user.id,
      },
    },
    include: {
      users: true,
      // Get all project group memberships
      projectgroupmember: {
        include: {
          projectgroup: {
            include: {
              // Project type (e.g., "Major Project", "Mini Project")
              projecttype: true,
              // Convener staff details
              staff_projectgroup_convenerstaffidTostaff: {
                select: {
                  staffid: true,
                  staffname: true,
                  email: true,
                  phone: true,
                },
              },
              // Expert staff details
              staff_projectgroup_expertstaffidTostaff: {
                select: {
                  staffid: true,
                  staffname: true,
                  email: true,
                  phone: true,
                },
              },
              // All meetings for this project
              projectmeeting: {
                include: {
                  staff: {
                    select: {
                      staffname: true,
                      email: true,
                    },
                  },
                },
                orderBy: {
                  meetingdatetime: "asc",
                },
              },
              // All group members
              projectgroupmember: {
                include: {
                  student: {
                    select: {
                      studentid: true,
                      studentname: true,
                      email: true,
                      phone: true,
                    },
                  },
                },
                orderBy: {
                  isgroupleader: "desc", // Leaders first
                },
              },
            },
          },
        },
      },
      // Get student's attendance records
      projectmeetingattendance: {
        include: {
          projectmeeting: {
            select: {
              meetingdatetime: true,
              meetingpurpose: true,
              meetinglocation: true,
            },
          },
        },
        orderBy: {
          projectmeeting: {
            meetingdatetime: "desc",
          },
        },
      },
    },
  });
  console.log(student);


  const announcements = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });


  const enrolledProjectsCount = student?.projectgroupmember?.length || 0;


  let projectProgress = 0;
  const primaryProject = student?.projectgroupmember?.[0]?.projectgroup;
  if (primaryProject?.averagecpi) {
    projectProgress = Math.round((Number(primaryProject.averagecpi) / 10) * 100);
  }

  // Upcoming Meetings Count (meetings with datetime >= now)
  const now = new Date();
  let upcomingMeetingsCount = 0;
  let allMeetings: any[] = [];

  if (student?.projectgroupmember) {
    student.projectgroupmember.forEach((membership) => {
      const meetings = membership.projectgroup.projectmeeting || [];
      allMeetings = [...allMeetings, ...meetings];
    });
  }

  const upcomingMeetings = allMeetings.filter(
    (m) => new Date(m.meetingdatetime) >= now
  );
  const pastMeetings = allMeetings.filter(
    (m) => new Date(m.meetingdatetime) < now
  );
  upcomingMeetingsCount = upcomingMeetings.length;

  // Attendance Statistics
  const attendanceRecords = student?.projectmeetingattendance || [];
  const totalAttendance = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((a) => a.ispresent).length;
  const attendancePercentage = totalAttendance > 0
    ? Math.round((presentCount / totalAttendance) * 100)
    : 0;

  // ============================================
  // 5. PREPARE DATA OBJECTS FOR UI
  // ============================================

  // Project Details
  const projectDetails = primaryProject ? {
    projectgroupid: primaryProject.projectgroupid,
    projectgroupname: primaryProject.projectgroupname,
    projecttitle: primaryProject.projecttitle,
    projectarea: primaryProject.projectarea,
    projectdescription: primaryProject.projectdescription,
    guidestaffname: primaryProject.guidestaffname,
    averagecpi: primaryProject.averagecpi
      ? primaryProject.averagecpi.toNumber()
      : null,
    projecttype: primaryProject.projecttype,
    convener: primaryProject.staff_projectgroup_convenerstaffidTostaff,
    expert: primaryProject.staff_projectgroup_expertstaffidTostaff,
  } : null;

  // Team Members
  const teamMembers = primaryProject?.projectgroupmember?.map((member) => ({
    studentid: member.student.studentid,
    studentname: member.student.studentname,
    email: member.student.email,
    phone: member.student.phone,
    isgroupleader: member.isgroupleader,
    studentcgpa: member.studentcgpa
      ? member.studentcgpa.toNumber()
      : null,
  })) || [];

  // Check if current student is the group leader
  const isGroupLeader = student?.projectgroupmember?.[0]?.isgroupleader || false;


  return (
    <div className="min-h-screen bg-[#050A14]">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050A14] to-[#050A14] pointer-events-none" />

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
              value={enrolledProjectsCount.toString()}
              iconName="FolderKanban"
              gradient="from-green-500 to-cyan-600"
              description="Active projects"
              index={0}
            />
            <StatCard
              title="Progress"
              value={`${projectProgress}%`}
              iconName="TrendingUp"
              gradient="from-blue-500 to-purple-600"
              description="Overall completion"
              index={1}
            />
            <StatCard
              title="Upcoming Meetings"
              value={upcomingMeetingsCount.toString()}
              iconName="Calendar"
              gradient="from-purple-500 to-pink-600"
              description="Scheduled"
              index={2}
            />
            <StatCard
              title="Attendance"
              value={`${attendancePercentage}%`}
              iconName="Bell"
              gradient="from-orange-500 to-red-600"
              description={`${presentCount}/${totalAttendance} present`}
              index={3}
            />
          </div>

          {/* Dashboard Content */}
          <StudentDashboardContent
            studentName={userName}
            projectDetails={projectDetails}
            teamMembers={teamMembers}
            upcomingMeetings={upcomingMeetings}
            pastMeetings={pastMeetings}
            attendanceRecords={attendanceRecords}
            announcements={announcements}
            projectProgress={projectProgress}
            isGroupLeader={isGroupLeader}
          />
        </div>
      </div>
    </div>
  );
}