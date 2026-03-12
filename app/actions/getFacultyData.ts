"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ============== HELPER FUNCTIONS ==============

// Helper function to get staff ID for current faculty user
async function getStaffId() {
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

// ============== GET FUNCTIONS (Fetch from Database) ==============

// Get all groups assigned to faculty
export async function getFacultyGroups() {
    const staff = await getStaffId();
    if (!staff) return [];

    // Also find groups where this faculty is a guide (from meetings)
    const guideGroupIds = await prisma.projectmeeting.findMany({
        where: { guidestaffid: staff.staffid },
        select: { projectgroupid: true },
        distinct: ['projectgroupid'],
    });
    const guideGroupIdList = guideGroupIds.map(g => g.projectgroupid);

    const groups = await prisma.projectgroup.findMany({
        where: {
            OR: [
                { convenerstaffid: staff.staffid },
                { expertstaffid: staff.staffid },
                ...(guideGroupIdList.length > 0 ? [{ projectgroupid: { in: guideGroupIdList } }] : []),
            ],
        },
        include: {
            projecttype: true,
            staff_projectgroup_convenerstaffidTostaff: {
                select: {
                    staffname: true,
                    email: true,
                },
            },
            staff_projectgroup_expertstaffidTostaff: {
                select: {
                    staffname: true,
                    email: true,
                },
            },
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
            },
            projectmeeting: {
                where: {
                    meetingdatetime: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    meetingdatetime: 'asc',
                },
                take: 1,
            },
        },
        orderBy: {
            projectgroupname: 'asc',
        },
    });

    return groups.map((group) => ({
        id: group.projectgroupid,
        name: group.projectgroupname,
        title: group.projecttitle,
        area: group.projectarea,
        description: group.projectdescription,
        projectType: group.projecttype?.projecttypename || null,
        averageCpi: group.averagecpi ? group.averagecpi.toNumber() : null,
        convener: group.staff_projectgroup_convenerstaffidTostaff,
        expert: group.staff_projectgroup_expertstaffidTostaff,
        memberCount: group.projectgroupmember.length,
        members: group.projectgroupmember.map((m) => ({
            id: m.student?.studentid,
            name: m.student?.studentname,
            email: m.student?.email,
            phone: m.student?.phone,
            isLeader: m.isgroupleader,
            cgpa: m.studentcgpa ? m.studentcgpa.toNumber() : null,
        })),
        nextMeeting: group.projectmeeting[0] ? {
            meetingdatetime: group.projectmeeting[0].meetingdatetime,
            meetingpurpose: group.projectmeeting[0].meetingpurpose,
            meetinglocation: group.projectmeeting[0].meetinglocation,
        } : null,
    }));
}

// Get single group by ID
export async function getFacultyGroupById(groupId: number) {
    const staff = await getStaffId();
    if (!staff) return null;

    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: groupId,
            OR: [
                { convenerstaffid: staff.staffid },
                { expertstaffid: staff.staffid },
            ],
        },
        include: {
            projecttype: true,
            staff_projectgroup_convenerstaffidTostaff: {
                select: {
                    staffid: true,
                    staffname: true,
                    email: true,
                    phone: true,
                },
            },
            staff_projectgroup_expertstaffidTostaff: {
                select: {
                    staffid: true,
                    staffname: true,
                    email: true,
                    phone: true,
                },
            },
            projectgroupmember: {
                include: {
                    student: true,
                },
            },
            projectmeeting: {
                orderBy: {
                    meetingdatetime: 'desc',
                },
            },
        },
    });

    if (!group) return null;

    return {
        id: group.projectgroupid,
        name: group.projectgroupname,
        title: group.projecttitle,
        area: group.projectarea,
        description: group.projectdescription,
        projectType: group.projecttype,
        averageCpi: group.averagecpi ? group.averagecpi.toNumber() : null,
        convener: group.staff_projectgroup_convenerstaffidTostaff,
        expert: group.staff_projectgroup_expertstaffidTostaff,
        members: group.projectgroupmember.map((m) => ({
            id: m.student?.studentid,
            name: m.student?.studentname,
            email: m.student?.email,
            phone: m.student?.phone,
            isLeader: m.isgroupleader,
            cgpa: m.studentcgpa ? m.studentcgpa.toNumber() : null,
        })),
        meetings: group.projectmeeting.map((meeting) => ({
            id: meeting.projectmeetingid,
            datetime: meeting.meetingdatetime,
            purpose: meeting.meetingpurpose,
            location: meeting.meetinglocation,
            status: meeting.meetingstatus,
            notes: meeting.meetingnotes,
        })),
    };
}

// Get all meetings for faculty
export async function getFacultyMeetings() {
    const staff = await getStaffId();
    if (!staff) return { upcoming: [], past: [] };

    const now = new Date();

    const [upcomingMeetings, pastMeetings] = await Promise.all([
        prisma.projectmeeting.findMany({
            where: {
                guidestaffid: staff.staffid,
                meetingdatetime: {
                    gte: now,
                },
            },
            include: {
                projectgroup: {
                    select: {
                        projectgroupid: true,
                        projectgroupname: true,
                        projecttitle: true,
                    },
                },
                projectmeetingattendance: {
                    include: {
                        student: {
                            select: {
                                studentid: true,
                                studentname: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                meetingdatetime: 'asc',
            },
        }),
        prisma.projectmeeting.findMany({
            where: {
                guidestaffid: staff.staffid,
                meetingdatetime: {
                    lt: now,
                },
            },
            include: {
                projectgroup: {
                    select: {
                        projectgroupid: true,
                        projectgroupname: true,
                        projecttitle: true,
                    },
                },
                projectmeetingattendance: {
                    include: {
                        student: {
                            select: {
                                studentid: true,
                                studentname: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                meetingdatetime: 'desc',
            },
            take: 20,
        }),
    ]);

    const formatMeetings = (meetings: typeof upcomingMeetings) =>
        meetings.map((meeting) => ({
            id: meeting.projectmeetingid,
            datetime: meeting.meetingdatetime,
            purpose: meeting.meetingpurpose,
            location: meeting.meetinglocation,
            status: meeting.meetingstatus,
            notes: meeting.meetingnotes,
            groupId: meeting.projectgroup?.projectgroupid,
            groupName: meeting.projectgroup?.projectgroupname,
            projectTitle: meeting.projectgroup?.projecttitle,
            attendees: meeting.projectmeetingattendance.map((a) => ({
                studentId: a.student?.studentid,
                name: a.student?.studentname,
                present: a.ispresent,
                remarks: a.attendanceremarks,
            })),
        }));

    return {
        upcoming: formatMeetings(upcomingMeetings),
        past: formatMeetings(pastMeetings),
    };
}

// Get pending reviews for faculty
export async function getFacultyReviews() {
    const staff = await getStaffId();
    if (!staff) return { pending: [], completed: [] };

    // Get meetings that need review (past meetings without notes/completed status)
    const [pendingReviews, completedReviews] = await Promise.all([
        prisma.projectmeeting.findMany({
            where: {
                guidestaffid: staff.staffid,
                meetingdatetime: {
                    lt: new Date(),
                },
                OR: [
                    { meetingstatus: null },
                    { meetingstatus: { not: 'Completed' } },
                ],
            },
            include: {
                projectgroup: {
                    select: {
                        projectgroupid: true,
                        projectgroupname: true,
                        projecttitle: true,
                    },
                },
                projectmeetingattendance: {
                    include: {
                        student: {
                            select: {
                                studentid: true,
                                studentname: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                meetingdatetime: 'desc',
            },
        }),
        prisma.projectmeeting.findMany({
            where: {
                guidestaffid: staff.staffid,
                meetingstatus: 'Completed',
            },
            include: {
                projectgroup: {
                    select: {
                        projectgroupid: true,
                        projectgroupname: true,
                        projecttitle: true,
                    },
                },
            },
            orderBy: {
                meetingdatetime: 'desc',
            },
            take: 20,
        }),
    ]);

    return {
        pending: pendingReviews.map((review) => ({
            id: review.projectmeetingid,
            datetime: review.meetingdatetime,
            purpose: review.meetingpurpose,
            location: review.meetinglocation,
            groupId: review.projectgroup?.projectgroupid,
            groupName: review.projectgroup?.projectgroupname,
            projectTitle: review.projectgroup?.projecttitle,
            attendees: review.projectmeetingattendance.map((a) => ({
                studentId: a.student?.studentid,
                name: a.student?.studentname,
                present: a.ispresent,
                remarks: a.attendanceremarks,
            })),
            attendeeCount: review.projectmeetingattendance.length,
            presentCount: review.projectmeetingattendance.filter((a) => a.ispresent).length,
        })),
        completed: completedReviews.map((review) => ({
            id: review.projectmeetingid,
            datetime: review.meetingdatetime,
            purpose: review.meetingpurpose,
            groupId: review.projectgroup?.projectgroupid,
            groupName: review.projectgroup?.projectgroupname,
            projectTitle: review.projectgroup?.projecttitle,
            notes: review.meetingnotes,
        })),
    };
}

// Get reports submitted to faculty
export async function getFacultyReports() {
    const staff = await getStaffId();
    if (!staff) return [];

    // Get groups assigned to this faculty with meeting counts
    const groups = await prisma.projectgroup.findMany({
        where: {
            OR: [
                { convenerstaffid: staff.staffid },
                { expertstaffid: staff.staffid },
            ],
        },
        include: {
            projectgroupmember: {
                select: {
                    student: {
                        select: {
                            studentid: true,
                            studentname: true,
                        },
                    },
                    isgroupleader: true,
                },
            },
            projectmeeting: {
                select: {
                    projectmeetingid: true,
                    meetingstatus: true,
                    meetingpurpose: true,
                },
            },
        },
    });

    return groups.map((group) => {
        const completedMeetings = group.projectmeeting.filter(m => m.meetingstatus === 'Completed').length;
        const pendingMeetings = group.projectmeeting.filter(m => m.meetingstatus !== 'Completed').length;
        const leader = group.projectgroupmember.find(m => m.isgroupleader);

        return {
            groupId: group.projectgroupid,
            groupName: group.projectgroupname,
            projectTitle: group.projecttitle,
            leaderName: leader?.student?.studentname || null,
            memberCount: group.projectgroupmember.length,
            totalMeetings: group.projectmeeting.length,
            completedMeetings,
            pendingMeetings,
        };
    });
}

// Get dashboard stats for faculty
export async function getFacultyDashboardStats() {
    const staff = await getStaffId();
    if (!staff) return null;

    const now = new Date();

    const [groupCount, upcomingMeetingsCount, pendingReviewsCount, totalStudents] = await Promise.all([
        prisma.projectgroup.count({
            where: {
                OR: [
                    { convenerstaffid: staff.staffid },
                    { expertstaffid: staff.staffid },
                ],
            },
        }),
        prisma.projectmeeting.count({
            where: {
                guidestaffid: staff.staffid,
                meetingdatetime: {
                    gte: now,
                },
            },
        }),
        prisma.projectmeeting.count({
            where: {
                guidestaffid: staff.staffid,
                meetingdatetime: {
                    lt: now,
                },
                OR: [
                    { meetingstatus: null },
                    { meetingstatus: { not: 'Completed' } },
                ],
            },
        }),
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
    ]);

    return {
        totalGroups: groupCount,
        upcomingMeetings: upcomingMeetingsCount,
        pendingReviews: pendingReviewsCount,
        totalStudents,
        staffName: staff.staffname,
        staffEmail: staff.email,
    };
}

// ============== CREATE FUNCTIONS (Upload to Database) ==============

// Create a new meeting
export async function createMeeting(data: {
    groupId: number;
    datetime: Date;
    purpose: string;
    location?: string;
    description?: string;
    sendNotification?: boolean;
}) {
    const staff = await getStaffId();
    if (!staff) {
        return { success: false, error: "Unauthorized: Staff not found" };
    }

    // Also check if faculty is guide for any meeting in this group
    const isGuide = await prisma.projectmeeting.findFirst({
        where: {
            projectgroupid: data.groupId,
            guidestaffid: staff.staffid,
        },
        select: { projectmeetingid: true },
    });

    // Verify staff has access to the group
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: data.groupId,
            OR: [
                { convenerstaffid: staff.staffid },
                { expertstaffid: staff.staffid },
                ...(isGuide ? [{ projectgroupid: data.groupId }] : []),
            ],
        },
        include: {
            projectgroupmember: {
                include: {
                    student: {
                        select: {
                            studentid: true,
                            studentname: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!group) {
        return { success: false, error: "Unauthorized: You don't have access to this group" };
    }

    try {
        const meeting = await prisma.projectmeeting.create({
            data: {
                projectgroupid: data.groupId,
                guidestaffid: staff.staffid,
                meetingdatetime: data.datetime,
                meetingpurpose: data.purpose,
                meetinglocation: data.location || null,
                description: data.description || null,
                meetingstatus: 'Scheduled',
            },
        });

        // Auto-create attendance records for all group members
        const groupMembers = group.projectgroupmember;
        if (groupMembers.length > 0) {
            await prisma.projectmeetingattendance.createMany({
                data: groupMembers.map(member => ({
                    projectmeetingid: meeting.projectmeetingid,
                    studentid: member.studentid,
                    ispresent: false,
                    attendanceremarks: null,
                })),
                skipDuplicates: true,
            });
        }

        // Send email notification to students if requested
        if (data.sendNotification !== false) {
            const studentEmails = group.projectgroupmember
                .map(m => m.student.email)
                .filter((email): email is string => email !== null);

            if (studentEmails.length > 0) {
                // Import and call email function dynamically to avoid issues
                const { sendMeetingNotification } = await import("@/lib/email");
                await sendMeetingNotification({
                    studentEmails,
                    meetingDetails: {
                        datetime: data.datetime,
                        purpose: data.purpose,
                        location: data.location || null,
                        groupName: group.projectgroupname,
                        facultyName: staff.staffname,
                    },
                });
            }
        }

        revalidatePath('/faculty/meetings');
        revalidatePath('/faculty/group');
        revalidatePath('/faculty/dashboard');

        return {
            success: true,
            meetingId: meeting.projectmeetingid,
        };
    } catch (error) {
        console.error("Error creating meeting:", error);
        return { success: false, error: "Failed to create meeting" };
    }
}

// Complete a meeting review
export async function completeMeetingReview(data: {
    meetingId: number;
    notes: string;
    attendance: { studentId: number; present: boolean; remarks?: string }[];
}) {
    const staff = await getStaffId();
    if (!staff) throw new Error("Unauthorized: Staff not found");

    // Verify staff owns this meeting
    const meeting = await prisma.projectmeeting.findFirst({
        where: {
            projectmeetingid: data.meetingId,
            guidestaffid: staff.staffid,
        },
    });

    if (!meeting) throw new Error("Meeting not found or unauthorized");

    // Update meeting status and notes
    await prisma.projectmeeting.update({
        where: { projectmeetingid: data.meetingId },
        data: {
            meetingstatus: 'Completed',
            meetingnotes: data.notes,
            meetingstatusdatetime: new Date(),
            modified: new Date(),
        },
    });

    // Update or create attendance records
    for (const att of data.attendance) {
        const existingAttendance = await prisma.projectmeetingattendance.findFirst({
            where: {
                projectmeetingid: data.meetingId,
                studentid: att.studentId,
            },
        });

        if (existingAttendance) {
            await prisma.projectmeetingattendance.update({
                where: { projectmeetingattendanceid: existingAttendance.projectmeetingattendanceid },
                data: {
                    ispresent: att.present,
                    attendanceremarks: att.remarks || null,
                    modified: new Date(),
                },
            });
        } else {
            await prisma.projectmeetingattendance.create({
                data: {
                    projectmeetingid: data.meetingId,
                    studentid: att.studentId,
                    ispresent: att.present,
                    attendanceremarks: att.remarks || null,
                },
            });
        }
    }

    revalidatePath('/faculty/reviews');
    revalidatePath('/faculty/meetings');

    return { success: true };
}

// Save attendance for any meeting (without completing review)
export async function saveAttendance(data: {
    meetingId: number;
    attendance: { studentId: number; present: boolean; remarks?: string }[];
}) {
    const staff = await getStaffId();
    if (!staff) return { success: false, error: "Unauthorized: Staff not found" };

    // Verify staff owns this meeting
    const meeting = await prisma.projectmeeting.findFirst({
        where: {
            projectmeetingid: data.meetingId,
            guidestaffid: staff.staffid,
        },
    });

    if (!meeting) return { success: false, error: "Meeting not found or unauthorized" };

    try {
        // Update or create attendance records
        for (const att of data.attendance) {
            const existingAttendance = await prisma.projectmeetingattendance.findFirst({
                where: {
                    projectmeetingid: data.meetingId,
                    studentid: att.studentId,
                },
            });

            if (existingAttendance) {
                await prisma.projectmeetingattendance.update({
                    where: { projectmeetingattendanceid: existingAttendance.projectmeetingattendanceid },
                    data: {
                        ispresent: att.present,
                        attendanceremarks: att.remarks || null,
                        modified: new Date(),
                    },
                });
            } else {
                await prisma.projectmeetingattendance.create({
                    data: {
                        projectmeetingid: data.meetingId,
                        studentid: att.studentId,
                        ispresent: att.present,
                        attendanceremarks: att.remarks || null,
                    },
                });
            }
        }

        revalidatePath('/faculty/meetings');
        revalidatePath('/faculty/reviews');

        return { success: true };
    } catch (error) {
        console.error("Error saving attendance:", error);
        return { success: false, error: "Failed to save attendance" };
    }
}

// ============== UPDATE FUNCTIONS ==============

// Update meeting details
export async function updateMeeting(data: {
    meetingId: number;
    datetime?: Date;
    purpose?: string;
    location?: string;
    status?: string;
    notes?: string;
}) {
    const staff = await getStaffId();
    if (!staff) throw new Error("Unauthorized: Staff not found");

    // Verify staff owns this meeting
    const meeting = await prisma.projectmeeting.findFirst({
        where: {
            projectmeetingid: data.meetingId,
            guidestaffid: staff.staffid,
        },
    });

    if (!meeting) throw new Error("Meeting not found or unauthorized");

    const updated = await prisma.projectmeeting.update({
        where: { projectmeetingid: data.meetingId },
        data: {
            ...(data.datetime && { meetingdatetime: data.datetime }),
            ...(data.purpose && { meetingpurpose: data.purpose }),
            ...(data.location !== undefined && { meetinglocation: data.location }),
            ...(data.status && {
                meetingstatus: data.status,
                meetingstatusdatetime: new Date(),
            }),
            ...(data.notes !== undefined && { meetingnotes: data.notes }),
            modified: new Date(),
        },
    });

    revalidatePath('/faculty/meetings');
    revalidatePath('/faculty/reviews');

    return {
        success: true,
        meeting: updated,
    };
}

// Update group details (for convener only)
export async function updateGroupDetails(data: {
    groupId: number;
    title?: string;
    area?: string;
    description?: string;
}) {
    const staff = await getStaffId();
    if (!staff) throw new Error("Unauthorized: Staff not found");

    // Verify staff is convener of this group
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: data.groupId,
            convenerstaffid: staff.staffid,
        },
    });

    if (!group) throw new Error("Unauthorized: Only convener can update group details");

    const updated = await prisma.projectgroup.update({
        where: { projectgroupid: data.groupId },
        data: {
            ...(data.title !== undefined && { projecttitle: data.title }),
            ...(data.area !== undefined && { projectarea: data.area }),
            ...(data.description !== undefined && { projectdescription: data.description }),
            modified: new Date(),
        },
    });

    revalidatePath('/faculty/group');

    return {
        success: true,
        group: updated,
    };
}

// ============== DELETE FUNCTIONS ==============

// Cancel/Delete a meeting
export async function deleteMeeting(meetingId: number) {
    const staff = await getStaffId();
    if (!staff) throw new Error("Unauthorized: Staff not found");

    // Verify staff owns this meeting
    const meeting = await prisma.projectmeeting.findFirst({
        where: {
            projectmeetingid: meetingId,
            guidestaffid: staff.staffid,
        },
    });

    if (!meeting) throw new Error("Meeting not found or unauthorized");

    // Delete associated attendance records first (cascade should handle this, but being explicit)
    await prisma.projectmeetingattendance.deleteMany({
        where: { projectmeetingid: meetingId },
    });

    await prisma.projectmeeting.delete({
        where: { projectmeetingid: meetingId },
    });

    revalidatePath('/faculty/meetings');
    revalidatePath('/faculty/reviews');

    return { success: true };
}

// ============== UTILITY FUNCTIONS ==============

// Get all project types (for dropdowns)
export async function getProjectTypes() {
    const types = await prisma.projecttype.findMany({
        orderBy: { projecttypename: 'asc' },
    });

    return types.map((t) => ({
        id: t.projecttypeid,
        name: t.projecttypename,
        description: t.description,
    }));
}

// Get students in a group (for attendance)
export async function getGroupStudents(groupId: number) {
    const staff = await getStaffId();
    if (!staff) return [];

    // Verify access
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: groupId,
            OR: [
                { convenerstaffid: staff.staffid },
                { expertstaffid: staff.staffid },
            ],
        },
        include: {
            projectgroupmember: {
                include: {
                    student: true,
                },
            },
        },
    });

    if (!group) return [];

    return group.projectgroupmember.map((m) => ({
        id: m.student.studentid,
        name: m.student.studentname,
        email: m.student.email,
        phone: m.student.phone,
        isLeader: m.isgroupleader,
        cgpa: m.studentcgpa ? m.studentcgpa.toNumber() : null,
    }));
}

// Search faculty groups
export async function searchFacultyGroups(query: string) {
    const staff = await getStaffId();
    if (!staff) return [];

    const groups = await prisma.projectgroup.findMany({
        where: {
            OR: [
                { convenerstaffid: staff.staffid },
                { expertstaffid: staff.staffid },
            ],
            AND: [
                {
                    OR: [
                        { projectgroupname: { contains: query, mode: 'insensitive' } },
                        { projecttitle: { contains: query, mode: 'insensitive' } },
                        { projectarea: { contains: query, mode: 'insensitive' } },
                    ],
                },
            ],
        },
        select: {
            projectgroupid: true,
            projectgroupname: true,
            projecttitle: true,
            projectarea: true,
        },
        take: 10,
    });

    return groups.map((g) => ({
        id: g.projectgroupid,
        name: g.projectgroupname,
        title: g.projecttitle,
        area: g.projectarea,
    }));
}

// ============== GROUP CREATION FUNCTIONS ==============

// Get all available students (not in any group or all students for selection)
export async function getAvailableStudents() {
    const staff = await getStaffId();
    if (!staff) return [];

    const students = await prisma.student.findMany({
        select: {
            studentid: true,
            studentname: true,
            email: true,
            phone: true,
            projectgroupmember: {
                select: {
                    projectgroupid: true,
                },
            },
        },
        orderBy: { studentname: 'asc' },
    });

    return students.map((s) => ({
        id: s.studentid,
        name: s.studentname,
        email: s.email,
        phone: s.phone,
        isInGroup: s.projectgroupmember.length > 0,
        groupCount: s.projectgroupmember.length,
    }));
}

// Get all staff members for convener/expert selection
export async function getAllStaff() {
    const staff = await getStaffId();
    if (!staff) return [];

    const allStaff = await prisma.staff.findMany({
        select: {
            staffid: true,
            staffname: true,
            email: true,
        },
        orderBy: { staffname: 'asc' },
    });

    return allStaff.map((s) => ({
        id: s.staffid,
        name: s.staffname,
        email: s.email,
    }));
}

// Create a new project group
export async function createGroup(data: {
    groupName: string;
    projectTitle?: string;
    projectArea?: string;
    projectDescription?: string;
    projectTypeId?: number;
    projectTypeName?: string;
    expertStaffId?: number;
    members: {
        studentId: number;
        isLeader: boolean;
        cgpa?: number;
    }[];
}) {
    const staff = await getStaffId();
    if (!staff) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        let finalProjectTypeId = data.projectTypeId;
        
        if (!finalProjectTypeId && data.projectTypeName) {
            let pt = await prisma.projecttype.findFirst({
                where: { projecttypename: data.projectTypeName }
            });
            if (!pt) {
                pt = await prisma.projecttype.create({
                    data: { projecttypename: data.projectTypeName }
                });
            }
            finalProjectTypeId = pt.projecttypeid;
        }

        if (!finalProjectTypeId) {
            return { success: false, error: "Project type is required" };
        }

        // Create the group with current staff as convener
        const group = await prisma.projectgroup.create({
            data: {
                projectgroupname: data.groupName,
                projecttitle: data.projectTitle || null,
                projectarea: data.projectArea || null,
                projectdescription: data.projectDescription || null,
                projecttypeid: finalProjectTypeId,
                convenerstaffid: staff.staffid,
                expertstaffid: data.expertStaffId || null,
                projectgroupmember: {
                    create: data.members.map((m) => ({
                        studentid: m.studentId,
                        isgroupleader: m.isLeader,
                        studentcgpa: m.cgpa || null,
                    })),
                },
            },
            include: {
                projectgroupmember: true,
            },
        });

        revalidatePath("/faculty/group");
        return { success: true, groupId: group.projectgroupid };
    } catch (error) {
        console.error("Error creating group:", error);
        return { success: false, error: "Failed to create group" };
    }
}

// Update a project group
export async function updateGroup(data: {
    groupId: number;
    groupName?: string;
    projectTitle?: string;
    projectArea?: string;
    projectDescription?: string;
    projectTypeId?: number;
    projectTypeName?: string;
    expertStaffId?: number;
}) {
    const staff = await getStaffId();
    if (!staff) {
        return { success: false, error: "Unauthorized" };
    }

    // Check if the faculty is the convener
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: data.groupId,
            convenerstaffid: staff.staffid,
        },
    });

    if (!group) {
        return { success: false, error: "Not authorized to update this group" };
    }

    try {
        let finalProjectTypeId = data.projectTypeId;
        if (!finalProjectTypeId && data.projectTypeName) {
            let pt = await prisma.projecttype.findFirst({
                where: { projecttypename: data.projectTypeName }
            });
            if (!pt) {
                pt = await prisma.projecttype.create({
                    data: { projecttypename: data.projectTypeName }
                });
            }
            finalProjectTypeId = pt.projecttypeid;
        }

        await prisma.projectgroup.update({
            where: { projectgroupid: data.groupId },
            data: {
                projectgroupname: data.groupName ?? group.projectgroupname,
                projecttitle: data.projectTitle ?? group.projecttitle,
                projectarea: data.projectArea ?? group.projectarea,
                projectdescription: data.projectDescription ?? group.projectdescription,
                projecttypeid: finalProjectTypeId ?? group.projecttypeid,
                expertstaffid: data.expertStaffId ?? group.expertstaffid,
                modified: new Date(),
            },
        });

        revalidatePath("/faculty/group");
        return { success: true };
    } catch (error) {
        console.error("Error updating group:", error);
        return { success: false, error: "Failed to update group" };
    }
}

// Add member to a group
export async function addGroupMember(data: {
    groupId: number;
    studentId: number;
    isLeader?: boolean;
    cgpa?: number;
}) {
    const staff = await getStaffId();
    if (!staff) {
        return { success: false, error: "Unauthorized" };
    }

    // Check if the faculty is the convener
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: data.groupId,
            convenerstaffid: staff.staffid,
        },
    });

    if (!group) {
        return { success: false, error: "Not authorized to modify this group" };
    }

    try {
        await prisma.projectgroupmember.create({
            data: {
                projectgroupid: data.groupId,
                studentid: data.studentId,
                isgroupleader: data.isLeader || false,
                studentcgpa: data.cgpa || null,
            },
        });

        revalidatePath("/faculty/group");
        return { success: true };
    } catch (error) {
        console.error("Error adding member:", error);
        return { success: false, error: "Failed to add member" };
    }
}

// Remove member from a group
export async function removeGroupMember(data: {
    groupId: number;
    studentId: number;
}) {
    const staff = await getStaffId();
    if (!staff) {
        return { success: false, error: "Unauthorized" };
    }

    // Check if the faculty is the convener
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: data.groupId,
            convenerstaffid: staff.staffid,
        },
    });

    if (!group) {
        return { success: false, error: "Not authorized to modify this group" };
    }

    try {
        await prisma.projectgroupmember.deleteMany({
            where: {
                projectgroupid: data.groupId,
                studentid: data.studentId,
            },
        });

        revalidatePath("/faculty/group");
        return { success: true };
    } catch (error) {
        console.error("Error removing member:", error);
        return { success: false, error: "Failed to remove member" };
    }
}

// Delete a project group
export async function deleteGroup(groupId: number) {
    const staff = await getStaffId();
    if (!staff) {
        return { success: false, error: "Unauthorized" };
    }

    // Check if the faculty is the convener
    const group = await prisma.projectgroup.findFirst({
        where: {
            projectgroupid: groupId,
            convenerstaffid: staff.staffid,
        },
    });

    if (!group) {
        return { success: false, error: "Not authorized to delete this group" };
    }

    try {
        // Delete the group (cascade will handle members and meetings)
        await prisma.projectgroup.delete({
            where: { projectgroupid: groupId },
        });

        revalidatePath("/faculty/group");
        return { success: true };
    } catch (error) {
        console.error("Error deleting group:", error);
        return { success: false, error: "Failed to delete group" };
    }
}
