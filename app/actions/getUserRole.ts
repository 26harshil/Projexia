'use server'

import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Role } from "../generated/prisma/enums";

/**
 * Gets user role from Prisma database. 
 * If user doesn't exist in DB, creates them with default STUDENT role
 * and syncs the role to Clerk publicMetadata.
 */
export async function getUserRole(): Promise<string | null> {
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
