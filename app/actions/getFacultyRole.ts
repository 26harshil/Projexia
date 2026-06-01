"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

// Get staff info for current faculty user
async function getStaffInfo() {
  const user = await currentUser();
  if (!user) return null;

  const staff = await prisma.staff.findFirst({
    where: {
      users: {
        clerkid: user.id,
      },
    },
    select: { staffid: true, staffname: true, email: true },
  });

  return staff;
}

// Get comprehensive dashboard stats for faculty
export async function getFacultyDashboardStats() {
  const staff = await getStaffInfo();
  if (!staff) return null;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [
    studentGroupsCount,
    totalStudentsCount,
    upcomingMeetingsCount,
    todayMeetingsCount,
    thisWeekMeetingsCount,
    pendingReviewsCount,
    completedMeetingsCount,
    totalMeetingsCount,
    recentGroups,
    upcomingMeetings,
    allGroups,
    recentMeetings,
    projectTypes,
  ] = await Promise.all([
    // Count of student groups
    prisma.projectgroup.count({
      where: {
        OR: [
          { convenerstaffid: staff.staffid },
          { expertstaffid: staff.staffid },
        ],
      },
    }),

    // Total students across groups
    prisma.projectgroupmember.count({
      where: {
        projectgroup: {
          OR: [
            { convenerstaffid: staff.staffid },
            { expertstaffid: staff.staffid },
          ],
        },
      },
    }),

    // Future meetings count
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
        meetingdatetime: { gte: now },
      },
    }),

    // Today's meetings count
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
        meetingdatetime: {
          gte: today,
          lt: tomorrow,
        },
      },
    }),

    // This week's meetings count
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
        meetingdatetime: {
          gte: now,
          lte: weekFromNow,
        },
      },
    }),

    // Pending reviews (past meetings not marked as completed)
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
        meetingdatetime: { lt: now },
        OR: [
          { meetingstatus: null },
          { meetingstatus: { not: "Completed" } },
        ],
      },
    }),

    // Completed meetings count
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
        meetingstatus: "Completed",
      },
    }),

    // Total meetings count (all time)
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
      },
    }),

    // Recent groups (for dashboard cards)
    prisma.projectgroup.findMany({
      where: {
        OR: [
          { convenerstaffid: staff.staffid },
          { expertstaffid: staff.staffid },
        ],
      },
      include: {
        projectgroupmember: {
          select: {
            isgroupleader: true,
            student: {
              select: {
                studentname: true,
              },
            },
          },
        },
        projecttype: true,
      },
      orderBy: { created: "desc" },
      take: 3,
    }),

    // Upcoming meetings (for dashboard list)
    prisma.projectmeeting.findMany({
      where: {
        guidestaffid: staff.staffid,
        meetingdatetime: { gte: now },
      },
      include: {
        projectgroup: {
          select: {
            projectgroupname: true,
            projecttitle: true,
          },
        },
      },
      orderBy: { meetingdatetime: "asc" },
      take: 5,
    }),

    // All groups with full details for project overview
    prisma.projectgroup.findMany({
      where: {
        OR: [
          { convenerstaffid: staff.staffid },
          { expertstaffid: staff.staffid },
        ],
      },
      include: {
        projecttype: true,
        projectgroupmember: {
          include: {
            student: {
              select: {
                studentname: true,
                email: true,
              },
            },
          },
        },
        projectmeeting: {
          orderBy: { meetingdatetime: "desc" },
          take: 1,
          select: {
            meetingdatetime: true,
            meetingstatus: true,
            meetingpurpose: true,
          },
        },
      },
      orderBy: { created: "desc" },
    }),

    // Recent meetings (created/updated activity) for activity feed
    prisma.projectmeeting.findMany({
      where: {
        guidestaffid: staff.staffid,
      },
      include: {
        projectgroup: {
          select: {
            projectgroupname: true,
            projecttitle: true,
          },
        },
        projectmeetingattendance: {
          select: {
            ispresent: true,
          },
        },
      },
      orderBy: { created: "desc" },
      take: 5,
    }),

    // Distinct project types across faculty's groups
    prisma.projecttype.findMany({
      where: {
        projectgroup: {
          some: {
            OR: [
              { convenerstaffid: staff.staffid },
              { expertstaffid: staff.staffid },
            ],
          },
        },
      },
      include: {
        _count: {
          select: { projectgroup: true },
        },
      },
    }),
  ]);

  // Calculate attendance rate from completed meetings
  let attendanceRate = 0;
  if (completedMeetingsCount > 0) {
    const totalAttendance = await prisma.projectmeetingattendance.count({
      where: {
        projectmeeting: {
          guidestaffid: staff.staffid,
          meetingstatus: "Completed",
        },
      },
    });

    const presentAttendance = await prisma.projectmeetingattendance.count({
      where: {
        projectmeeting: {
          guidestaffid: staff.staffid,
          meetingstatus: "Completed",
        },
        ispresent: true,
      },
    });

    attendanceRate =
      totalAttendance > 0
        ? Math.round((presentAttendance / totalAttendance) * 100)
        : 0;
  }

  // Compute meeting completion rate
  const meetingCompletionRate =
    totalMeetingsCount > 0
      ? Math.round((completedMeetingsCount / totalMeetingsCount) * 100)
      : 0;

  return {
    staffName: staff.staffname,
    staffEmail: staff.email,
    studentGroups: studentGroupsCount,
    totalStudents: totalStudentsCount,
    upcomingMeetings: upcomingMeetingsCount,
    todayMeetings: todayMeetingsCount,
    thisWeekMeetings: thisWeekMeetingsCount,
    pendingReviews: pendingReviewsCount,
    completedMeetings: completedMeetingsCount,
    totalMeetings: totalMeetingsCount,
    meetingCompletionRate,
    attendanceRate,
    projectTypesCount: projectTypes.length,
    recentGroups: recentGroups.map((group) => ({
      id: group.projectgroupid,
      name: group.projectgroupname,
      title: group.projecttitle,
      projectType: group.projecttype?.projecttypename || null,
      memberCount: group.projectgroupmember.length,
      leaderName:
        group.projectgroupmember.find((m) => m.isgroupleader)?.student
          ?.studentname || null,
    })),
    upcomingMeetingsList: upcomingMeetings.map((meeting) => ({
      id: meeting.projectmeetingid,
      datetime: meeting.meetingdatetime,
      purpose: meeting.meetingpurpose,
      location: meeting.meetinglocation,
      groupName: meeting.projectgroup?.projectgroupname,
      projectTitle: meeting.projectgroup?.projecttitle,
    })),
    // All groups with progress data
    groupsOverview: allGroups.map((group) => {
      const totalMembers = group.projectgroupmember.length;
      const leader = group.projectgroupmember.find(
        (m) => m.isgroupleader
      );
      const lastMeeting = group.projectmeeting[0] || null;
      return {
        id: group.projectgroupid,
        name: group.projectgroupname,
        title: group.projecttitle,
        area: group.projectarea,
        description: group.projectdescription,
        deadline: group.projectdeadline,
        progress: group.projectprogress,
        marks: group.projectmarks ? group.projectmarks.toNumber() : null,
        feedback: group.projectfeedback,
        projectType: group.projecttype?.projecttypename || null,
        memberCount: totalMembers,
        leaderName: leader?.student?.studentname || null,
        lastMeetingDate: lastMeeting?.meetingdatetime || null,
        lastMeetingStatus: lastMeeting?.meetingstatus || null,
        lastMeetingPurpose: lastMeeting?.meetingpurpose || null,
        created: group.created,
      };
    }),
    // Recent activity feed
    recentActivity: recentMeetings.map((meeting) => {
      const totalAttendees = meeting.projectmeetingattendance.length;
      const presentCount = meeting.projectmeetingattendance.filter(
        (a) => a.ispresent
      ).length;
      return {
        id: meeting.projectmeetingid,
        type: "meeting" as const,
        datetime: meeting.meetingdatetime,
        purpose: meeting.meetingpurpose,
        status: meeting.meetingstatus,
        groupName: meeting.projectgroup?.projectgroupname,
        projectTitle: meeting.projectgroup?.projecttitle,
        totalAttendees,
        presentCount,
      };
    }),
    // Project type breakdown
    projectTypeBreakdown: projectTypes.map((pt) => ({
      id: pt.projecttypeid,
      name: pt.projecttypename,
      groupCount: pt._count.projectgroup,
    })),
  };
}
