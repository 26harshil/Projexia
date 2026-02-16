'use server'

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "../generated/prisma/enums";

/**
 * Gets user role from Prisma database with Clerk sync.
 * 
 * Flow:
 * 1. Check if user exists in Prisma DB
 * 2. If exists, sync role to Clerk metadata if missing
 * 3. If not exists, create user with default STUDENT role
 * 4. Sync role to Clerk publicMetadata
 * 
 * @returns User's role (ADMIN, FACULTY, or STUDENT) or null if not authenticated
 */
export async function getUserRole(): Promise<Role | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  try {
    // 1. Check if user already exists in Prisma
    let user = await prisma.users.findUnique({
      where: { clerkid: userId },
      select: { role: true },
    });

    // 2. If user exists, check if Clerk metadata needs sync
    if (user) {
      const clerkRole = sessionClaims?.metadata?.role as string;

      // If Clerk metadata is missing, sync it from Prisma
      if (!clerkRole) {
        console.log("🔄 Syncing role to Clerk metadata:", user.role);
        const client = await clerkClient();
        await client.users.updateUser(userId, {
          publicMetadata: { role: user.role },
        });
      }

      return user.role;
    }

    // 3. User NOT in DB - Create them with default STUDENT role
    console.log("🆕 New user detected, creating in Prisma...");

    // Get user details from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      console.error("❌ Could not fetch Clerk user");
      return null;
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      console.error("❌ No email found for user");
      return null;
    }

    const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Unknown User";
    const defaultRole = Role.STUDENT;

    // 4. Create user in Prisma
    const newUser = await prisma.users.create({
      data: {
        clerkid: userId,
        email: email,
        name: name,
        role: defaultRole,
        isactive: true,
      },
    });
    console.log("✅ User created in Prisma with ID:", newUser.userid);

    // 4.5 Auto-create student record (since default role is STUDENT)
    try {
      await prisma.student.create({
        data: {
          studentname: name,
          email: email,
          userid: newUser.userid,
        },
      });
      console.log("✅ Student record created for user:", newUser.userid);
    } catch (studentError) {
      console.error("⚠️ Failed to create student record:", studentError);
      // Don't throw - the user itself was created successfully
    }

    // 5. Sync role to Clerk publicMetadata
    console.log("🔄 Setting Clerk publicMetadata.role to:", defaultRole);
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role: defaultRole },
    });
    console.log("✅ Clerk metadata synced");

    return defaultRole;

  } catch (error) {
    console.error("❌ Error in getUserRole:", error);
    return null;
  }
}
