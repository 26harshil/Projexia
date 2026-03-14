'use server'

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Get all project groups assigned to the current student
 */
export async function getStudentProjectGroups() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Get current user's student record
    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: {
            student: true,
        },
    });

    if (!dbUser?.student) throw new Error("Student record not found");

    // Get all project groups for this student with full details
    const projectGroups = await prisma.projectgroupmember.findMany({
        where: {
            studentid: dbUser.student.studentid,
        },
        include: {
            projectgroup: {
                include: {
                    projecttype: true,
                    staff_projectgroup_convenerstaffidTostaff: true,
                    projectgroupmember: {
                        include: {
                            student: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            created: 'desc',
        },
    });

    // Serialize Decimal fields and format response
    const serializedGroups = JSON.parse(JSON.stringify(projectGroups));

    return serializedGroups.map((membership: any) => ({
        membershipId: membership.projectgroupmemberid,
        isGroupLeader: membership.isgroupleader,
        studentCGPA: membership.studentcgpa,
        projectGroup: {
            groupId: membership.projectgroup.projectgroupid,
            groupName: membership.projectgroup.projectgroupname,
            projectTitle: membership.projectgroup.projecttitle,
            projectArea: membership.projectgroup.projectarea,
            projectDescription: membership.projectgroup.projectdescription,
            averageCPI: membership.projectgroup.averagecpi,
            projectStatus: membership.projectgroup.projectstatus,
            projectType: membership.projectgroup.projecttype?.projecttypename,
            guideFaculty: membership.projectgroup.staff_projectgroup_convenerstaffidTostaff?.staffname,
            guideFacultyEmail: membership.projectgroup.staff_projectgroup_convenerstaffidTostaff?.email,
            createdAt: membership.projectgroup.created,
            members: membership.projectgroup.projectgroupmember.map((m: any) => ({
                memberId: m.projectgroupmemberid,
                studentId: m.studentid,
                studentName: m.student.studentname,
                studentEmail: m.student.email,
                studentPhone: m.student.phone,
                isLeader: m.isgroupleader,
                joinedAt: m.created,
            })),
        },
    }));
}

/**
 * Get a specific project group details with all members
 */
export async function getProjectGroupDetails(projectGroupId: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Get current user's student record
    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: {
            student: true,
        },
    });

    if (!dbUser?.student) throw new Error("Student record not found");

    // Get project group with all details
    const projectGroup = await prisma.projectgroup.findUnique({
        where: {
            projectgroupid: projectGroupId,
        },
        include: {
            projecttype: true,
            staff_projectgroup_convenerstaffidTostaff: true,
            staff_projectgroup_expertstaffidTostaff: true,
            projectgroupmember: {
                include: {
                    student: true,
                },
                orderBy: {
                    isgroupleader: 'desc',
                },
            },
        },
    });

    if (!projectGroup) throw new Error("Project group not found");

    // Verify user is member of this group
    const isMember = projectGroup.projectgroupmember.some(
        m => m.studentid === dbUser.student!.studentid
    );
    if (!isMember) throw new Error("Not a member of this group");

    // Serialize and format response
    const serialized = JSON.parse(JSON.stringify(projectGroup));

    return {
        groupId: serialized.projectgroupid,
        groupName: serialized.projectgroupname,
        projectTitle: serialized.projecttitle,
        projectArea: serialized.projectarea,
        projectDescription: serialized.projectdescription,
        averageCPI: serialized.averagecpi,
        projectStatus: serialized.projectstatus,
        projectType: serialized.projecttype?.projecttypename,
        guideFaculty: serialized.staff_projectgroup_convenerstaffidTostaff?.staffname,
        guideFacultyEmail: serialized.staff_projectgroup_convenerstaffidTostaff?.email,
        expertFaculty: serialized.staff_projectgroup_expertstaffidTostaff?.staffname,
        createdAt: serialized.created,
        members: serialized.projectgroupmember.map((m: any) => ({
            memberId: m.projectgroupmemberid,
            studentId: m.studentid,
            studentName: m.student.studentname,
            studentEmail: m.student.email,
            studentPhone: m.student.phone,
            isLeader: m.isgroupleader,
            cgpa: m.studentcgpa,
            joinedAt: m.created,
        })),
    };
}

/**
 * Get all meetings for the current student with attendance information
 */
export async function getStudentMeetings() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Get current user's student record
    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: {
            student: true,
        },
    });

    if (!dbUser?.student) throw new Error("Student record not found");

    const studentId = dbUser.student.studentid;

    // Get all meetings from student's project groups
    const meetings = await prisma.projectmeeting.findMany({
        where: {
            projectgroup: {
                projectgroupmember: {
                    some: {
                        studentid: studentId,
                    },
                },
            },
        },
        include: {
            projectgroup: {
                select: {
                    projectgroupid: true,
                    projectgroupname: true,
                    projecttitle: true,
                    staff_projectgroup_convenerstaffidTostaff: {
                        select: {
                            staffname: true,
                            email: true,
                        },
                    },
                },
            },
            staff: {
                select: {
                    staffname: true,
                    email: true,
                },
            },
            projectmeetingattendance: {
                where: {
                    studentid: studentId,
                },
                select: {
                    ispresent: true,
                    attendanceremarks: true,
                },
            },
        },
        orderBy: {
            meetingdatetime: 'desc',
        },
    });

    // Serialize and format response
    const now = new Date();
    const serialized = JSON.parse(JSON.stringify(meetings));

    const formattedMeetings = serialized.map((meeting: any) => ({
        id: meeting.projectmeetingid,
        datetime: meeting.meetingdatetime,
        purpose: meeting.meetingpurpose || 'Meeting',
        location: meeting.meetinglocation,
        status: meeting.meetingstatus,
        notes: meeting.meetingnotes,
        grade: meeting.meetinggrade,
        description: meeting.description,
        groupId: meeting.projectgroup.projectgroupid,
        groupName: meeting.projectgroup.projectgroupname,
        projectTitle: meeting.projectgroup.projecttitle,
        guide: meeting.projectgroup.staff_projectgroup_convenerstaffidTostaff?.staffname,
        guideEmail: meeting.projectgroup.staff_projectgroup_convenerstaffidTostaff?.email,
        attendance: {
            isPresent: meeting.projectmeetingattendance[0]?.ispresent ?? null,
            remarks: meeting.projectmeetingattendance[0]?.attendanceremarks,
        },
    }));

    // Split into upcoming and past
    const upcoming = formattedMeetings.filter((m: any) => new Date(m.datetime) >= now);
    const past = formattedMeetings.filter((m: any) => new Date(m.datetime) < now);

    return {
        upcoming: upcoming.sort((a: any, b: any) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()),
        past: past.sort((a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()),
    };
}
