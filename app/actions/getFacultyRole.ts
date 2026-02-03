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
    recentGroups,
    upcomingMeetings,
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
          { meetingstatus: { not: 'Completed' } },
        ],
      },
    }),

    // Completed meetings count
    prisma.projectmeeting.count({
      where: {
        guidestaffid: staff.staffid,
        meetingstatus: 'Completed',
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
      orderBy: { created: 'desc' },
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
      orderBy: { meetingdatetime: 'asc' },
      take: 5,
    }),
  ]);

  // Calculate attendance rate from completed meetings
  let attendanceRate = 0;
  if (completedMeetingsCount > 0) {
    const totalAttendance = await prisma.projectmeetingattendance.count({
      where: {
        projectmeeting: {
          guidestaffid: staff.staffid,
          meetingstatus: 'Completed',
        },
      },
    });

    const presentAttendance = await prisma.projectmeetingattendance.count({
      where: {
        projectmeeting: {
          guidestaffid: staff.staffid,
          meetingstatus: 'Completed',
        },
        ispresent: true,
      },
    });

    attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;
  }

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
    attendanceRate,
    assignedCourses: 0, // Add when course table exists
    recentGroups: recentGroups.map((group) => ({
      id: group.projectgroupid,
      name: group.projectgroupname,
      title: group.projecttitle,
      projectType: group.projecttype?.projecttypename || null,
      memberCount: group.projectgroupmember.length,
      leaderName: group.projectgroupmember.find(m => m.isgroupleader)?.student?.studentname || null,
    })),
    upcomingMeetingsList: upcomingMeetings.map((meeting) => ({
      id: meeting.projectmeetingid,
      datetime: meeting.meetingdatetime,
      purpose: meeting.meetingpurpose,
      location: meeting.meetinglocation,
      groupName: meeting.projectgroup?.projectgroupname,
      projectTitle: meeting.projectgroup?.projecttitle,
    })),
  };
}
