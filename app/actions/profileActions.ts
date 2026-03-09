'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Get full profile data for the currently authenticated user.
 * Combines Clerk user info + Prisma DB data + student/staff records.
 */
export async function getProfileData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    // Get Clerk user data (avatar, full name, etc.)
    const clerkUser = await currentUser();
    if (!clerkUser) throw new Error("Could not fetch user from Clerk");

    // Get Prisma DB data including student/staff records
    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: {
            student: {
                include: {
                    projectgroupmember: {
                        include: {
                            projectgroup: {
                                select: {
                                    projectgroupname: true,
                                    projecttitle: true,
                                    projectarea: true,
                                },
                            },
                        },
                    },
                },
            },
            staff: true,
        },
    });

    if (!dbUser) throw new Error("User not found in database");

    // Serialize Decimal fields
    const serializedUser = JSON.parse(JSON.stringify(dbUser));

    return {
        // Clerk info
        clerkId: userId,
        firstName: clerkUser.firstName || "",
        lastName: clerkUser.lastName || "",
        imageUrl: clerkUser.imageUrl,
        emailAddresses: clerkUser.emailAddresses.map(e => ({
            email: e.emailAddress,
            isPrimary: e.id === clerkUser.primaryEmailAddressId,
        })),
        phoneNumbers: clerkUser.phoneNumbers.map(p => ({
            phone: p.phoneNumber,
        })),
        createdAtClerk: clerkUser.createdAt,
        lastSignInAt: clerkUser.lastSignInAt,

        // DB info
        userid: serializedUser.userid,
        email: serializedUser.email,
        name: serializedUser.name,
        role: serializedUser.role,
        isactive: serializedUser.isactive,
        createdAt: serializedUser.created,
        modifiedAt: serializedUser.modified,

        // Student info (if exists)
        student: serializedUser.student ? {
            studentid: serializedUser.student.studentid,
            studentname: serializedUser.student.studentname,
            phone: serializedUser.student.phone,
            email: serializedUser.student.email,
            description: serializedUser.student.description,
            projectGroups: serializedUser.student.projectgroupmember?.map((m: any) => ({
                groupName: m.projectgroup.projectgroupname,
                projectTitle: m.projectgroup.projecttitle,
                projectArea: m.projectgroup.projectarea,
                isLeader: m.isgroupleader,
            })) || [],
        } : null,

        // Staff info (if exists)
        staff: serializedUser.staff ? {
            staffid: serializedUser.staff.staffid,
            staffname: serializedUser.staff.staffname,
            phone: serializedUser.staff.phone,
            email: serializedUser.staff.email,
            description: serializedUser.staff.description,
        } : null,
    };
}
