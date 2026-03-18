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
            enrollment: serializedUser.student.enrollment,
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

/**
 * Update the display name stored in users.name
 */
export async function updateProfileName(name: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const trimmedName = name.trim();
    if (!trimmedName) throw new Error("Name is required");

    const updated = await prisma.users.update({
        where: { clerkid: userId },
        data: { name: trimmedName },
    });

    return updated;
}

/**
 * Update student phone number
 */
export async function updateStudentPhone(phone: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: { student: true },
    });

    if (!dbUser || !dbUser.student) throw new Error("Student not found");

    const updated = await prisma.student.update({
        where: { studentid: dbUser.student.studentid },
        data: { phone },
    });

    return updated;
}

/**
 * Update student enrollment number.
 * Enrollment is a dedicated field and is independent from users.userid.
 */
export async function updateStudentEnrollmentNumber(enrollmentNumber: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");
    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: { student: true },
    });

    if (!dbUser || !dbUser.student) throw new Error("Student not found");

    const updated = await prisma.student.update({
        where: { studentid: dbUser.student.studentid },
        data: { enrollment: enrollmentNumber },
    });

    return updated;
}

/**
 * Update faculty phone number
 */
export async function updateFacultyPhone(phone: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: { staff: true },
    });

    if (!dbUser || !dbUser.staff) throw new Error("Faculty not found");

    const updated = await prisma.staff.update({
        where: { staffid: dbUser.staff.staffid },
        data: { phone },
    });

    return updated;
}

/**
 * Update admin phone number.
 * Admins may have a linked staff record; if so, phone is stored there.
 * If no staff record is linked, a new one is created and linked to the user.
 */
export async function updateAdminPhone(phone: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Not authenticated");

    const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        include: { staff: true },
    });

    if (!dbUser) throw new Error("User not found");

    if (dbUser.staff) {
        // Update existing staff record
        return await prisma.staff.update({
            where: { staffid: dbUser.staff.staffid },
            data: { phone },
        });
    } else {
        // Create a staff record and link it to the user
        const newStaff = await prisma.staff.create({
            data: {
                staffname: dbUser.name || dbUser.email,
                email: dbUser.email,
                phone,
                userid: dbUser.userid,
            },
        });
        return newStaff;
    }
}
