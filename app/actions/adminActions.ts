'use server'

import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/app/generated/prisma/client";  

/**
 * Verify the current user is an admin
 */
async function verifyAdmin() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const user = await prisma.users.findUnique({
        where: { clerkid: userId },
        select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
        throw new Error("Unauthorized: Admin access required");
    }

    return userId;
}

/**
 * Fetch all users from the database
 */
export async function getAllUsers() {
    await verifyAdmin();

    const users = await prisma.users.findMany({
        orderBy: { created: "desc" },
        select: {
            userid: true,
            clerkid: true,
            email: true,
            name: true,
            role: true,
            isactive: true,
            created: true,
            modified: true,
        },
    });

    return users;
}

/**
 * Get user counts by role
 */
export async function getUserStats() {
    await verifyAdmin();

    const [totalUsers, adminCount, facultyCount, studentCount, activeCount, inactiveCount] = await Promise.all([
        prisma.users.count(),
        prisma.users.count({ where: { role: "ADMIN" } }),
        prisma.users.count({ where: { role: "FACULTY" } }),
        prisma.users.count({ where: { role: "STUDENT" } }),
        prisma.users.count({ where: { isactive: true } }),
        prisma.users.count({ where: { isactive: false } }),
    ]);

    return {
        totalUsers,
        adminCount,
        facultyCount,
        studentCount,
        activeCount,
        inactiveCount,
    };
}

/**
 * Update user role in Prisma DB, sync to Clerk metadata,
 * and manage student/staff table records accordingly.
 *
 * - STUDENT role → ensure student record exists, remove staff if safe
 * - FACULTY/ADMIN role → ensure staff record exists, remove student if safe
 */
export async function updateUserRole(targetUserId: number, newRole: Role) {
    await verifyAdmin();

    // 1. Get current user info (including existing student/staff links)
    const currentUserData = await prisma.users.findUnique({
        where: { userid: targetUserId },
        select: {
            userid: true,
            clerkid: true,
            email: true,
            name: true,
            role: true,
            student: { select: { studentid: true } },
            staff: { select: { staffid: true } },
        },
    });

    if (!currentUserData) throw new Error("User not found");

    const previousRole = currentUserData.role;

    // 2. Update role in Prisma database
    const updatedUser = await prisma.users.update({
        where: { userid: targetUserId },
        data: {
            role: newRole,
            modified: new Date(),
        },
        select: {
            userid: true,
            clerkid: true,
            email: true,
            name: true,
            role: true,
            isactive: true,
            created: true,
            modified: true,
        },
    });

    // 3. Sync role to Clerk publicMetadata
    try {
        const client = await clerkClient();
        await client.users.updateUser(updatedUser.clerkid, {
            publicMetadata: { role: newRole },
        });
        console.log(`✅ Synced role "${newRole}" to Clerk for user ${updatedUser.clerkid}`);
    } catch (clerkError) {
        console.error("❌ Failed to sync role to Clerk:", clerkError);
    }

    // 4. Manage student/staff table records based on new role
    const userName = currentUserData.name || "Unknown User";
    const userEmail = currentUserData.email;

    if (newRole === "STUDENT") {
        // Ensure student record exists
        if (!currentUserData.student) {
            await prisma.student.create({
                data: {
                    studentname: userName,
                    email: userEmail,
                    userid: targetUserId,
                },
            });
            console.log(`✅ Created student record for user ${targetUserId}`);
        }

        // Remove staff record if it exists and has no dependencies
        if (currentUserData.staff) {
            const staffDeps = await prisma.projectmeeting.count({
                where: { guidestaffid: currentUserData.staff.staffid },
            });
            const convenerDeps = await prisma.projectgroup.count({
                where: { convenerstaffid: currentUserData.staff.staffid },
            });
            const expertDeps = await prisma.projectgroup.count({
                where: { expertstaffid: currentUserData.staff.staffid },
            });

            if (staffDeps === 0 && convenerDeps === 0 && expertDeps === 0) {
                await prisma.staff.delete({
                    where: { staffid: currentUserData.staff.staffid },
                });
                console.log(`🗑️ Removed staff record for user ${targetUserId} (no dependencies)`);
            } else {
                console.log(`⚠️ Kept staff record for user ${targetUserId} (has ${staffDeps + convenerDeps + expertDeps} dependencies)`);
            }
        }
    } else {
        // FACULTY or ADMIN → ensure staff record exists
        if (!currentUserData.staff) {
            await prisma.staff.create({
                data: {
                    staffname: userName,
                    email: userEmail,
                    userid: targetUserId,
                },
            });
            console.log(`✅ Created staff record for user ${targetUserId}`);
        }

        // Remove student record if it exists and has no dependencies
        if (currentUserData.student) {
            const memberDeps = await prisma.projectgroupmember.count({
                where: { studentid: currentUserData.student.studentid },
            });
            const attendanceDeps = await prisma.projectmeetingattendance.count({
                where: { studentid: currentUserData.student.studentid },
            });

            if (memberDeps === 0 && attendanceDeps === 0) {
                await prisma.student.delete({
                    where: { studentid: currentUserData.student.studentid },
                });
                console.log(`🗑️ Removed student record for user ${targetUserId} (no dependencies)`);
            } else {
                console.log(`⚠️ Kept student record for user ${targetUserId} (has ${memberDeps + attendanceDeps} dependencies)`);
            }
        }
    }

    return updatedUser;
}

/**
 * Toggle user active status
 */
export async function toggleUserActive(targetUserId: number, isActive: boolean) {
    await verifyAdmin();

    const updatedUser = await prisma.users.update({
        where: { userid: targetUserId },
        data: {
            isactive: isActive,
            modified: new Date(),
        },
        select: {
            userid: true,
            clerkid: true,
            email: true,
            name: true,
            role: true,
            isactive: true,
            created: true,
            modified: true,
        },
    });

    return updatedUser;
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string) {
    await verifyAdmin();

    const users = await prisma.users.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: { created: "desc" },
        select: {
            userid: true,
            clerkid: true,
            email: true,
            name: true,
            role: true,
            isactive: true,
            created: true,
            modified: true,
        },
    });

    return users;
}

/**
 * Fetch all students from the student table with their linked user info
 */
export async function getAllStudents() {
    await verifyAdmin();

    const students = await prisma.student.findMany({
        orderBy: { created: "desc" },
        include: {
            users: {
                select: {
                    role: true,
                    isactive: true,
                    clerkid: true,
                },
            },
            projectgroupmember: {
                include: {
                    projectgroup: {
                        select: {
                            projectgroupname: true,
                            projecttitle: true,
                        },
                    },
                },
            },
        },
    });

    // Serialize to plain objects (converts Decimal → number, Date → string)
    return JSON.parse(JSON.stringify(students));
}

/**
 * Get student stats
 */
export async function getStudentStats() {
    await verifyAdmin();

    const [totalStudents, activeStudents, studentsInGroups] = await Promise.all([
        prisma.student.count(),
        prisma.student.count({
            where: {
                users: { isactive: true },
            },
        }),
        prisma.projectgroupmember.findMany({
            select: { studentid: true },
            distinct: ["studentid"],
        }),
    ]);

    return {
        totalStudents,
        activeStudents,
        inactiveStudents: totalStudents - activeStudents,
        studentsInGroups: studentsInGroups.length,
    };
}

/**
 * Fetch all project groups with members, type, and guide info
 */
export async function getAllProjectGroups() {
    await verifyAdmin();

    const projects = await prisma.projectgroup.findMany({
        orderBy: { created: "desc" },
        include: {
            projecttype: {
                select: {
                    projecttypename: true,
                },
            },
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
            staff_projectgroup_convenerstaffidTostaff: {
                select: {
                    staffname: true,
                },
            },
            staff_projectgroup_expertstaffidTostaff: {
                select: {
                    staffname: true,
                },
            },
        },
    });

    // Serialize to plain objects (converts Decimal → number, Date → string)
    return JSON.parse(JSON.stringify(projects));
}

/**
 * Get project stats
 */
export async function getProjectStats() {
    await verifyAdmin();

    const [totalProjects, totalProjectTypes, totalMembers, totalMeetings] = await Promise.all([
        prisma.projectgroup.count(),
        prisma.projecttype.count(),
        prisma.projectgroupmember.count(),
        prisma.projectmeeting.count(),
    ]);

  return {
    totalProjects,
    totalProjectTypes,
    totalMembers,
    totalMeetings,
  };
}

export async function updateProjectGroupByAdmin(data: {
    groupId: number;
    projectDeadline?: Date | null;
    projectProgress?: number;
    projectMarks?: number | null;
    projectFeedback?: string | null;
}) {
    await verifyAdmin();

    const project = await prisma.projectgroup.findUnique({
        where: { projectgroupid: data.groupId },
        select: {
            projectgroupid: true,
            projectdeadline: true,
            projectprogress: true,
            projectmarks: true,
            projectfeedback: true,
        },
    });

    if (!project) {
        throw new Error("Project group not found");
    }

    const normalizedProgress =
        data.projectProgress === undefined
            ? project.projectprogress
            : Math.min(100, Math.max(0, Math.round(data.projectProgress)));

    const updated = await prisma.projectgroup.update({
        where: { projectgroupid: data.groupId },
        data: {
            projectdeadline:
                data.projectDeadline === undefined
                    ? project.projectdeadline
                    : data.projectDeadline,
            projectprogress: normalizedProgress,
            projectmarks:
                data.projectMarks === undefined
                    ? project.projectmarks
                    : data.projectMarks,
            projectfeedback:
                data.projectFeedback === undefined
                    ? project.projectfeedback
                    : data.projectFeedback,
            modified: new Date(),
        },
    });

    return JSON.parse(JSON.stringify(updated));
}

/**
 * Get report/overview stats - aggregated data for the reports page
 */
export async function getReportStats() {
    await verifyAdmin();

    const [
        totalUsers,
        totalStudents,
        totalStaff,
        totalProjects,
        totalProjectTypes,
        totalMeetings,
        totalGroupMembers,
    ] = await Promise.all([
        prisma.users.count(),
        prisma.student.count(),
        prisma.staff.count(),
        prisma.projectgroup.count(),
        prisma.projecttype.count(),
        prisma.projectmeeting.count(),
        prisma.projectgroupmember.count(),
    ]);

    return {
        totalUsers,
        totalStudents,
        totalStaff,
        totalProjects,
        totalProjectTypes,
        totalMeetings,
        totalGroupMembers,
    };
}
