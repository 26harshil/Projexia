import { serverClient } from "@/lib/stream";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/chat/sync-group
 * 
 * Called when a student or faculty member enters the chat page.
 * Syncs all project groups the user belongs to as Stream channels,
 * so the user sees their project-specific group chats.
 */
export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in DB
    const dbUser = await prisma.users.findUnique({
      where: { clerkid: userId },
      select: { userid: true, role: true, name: true, student: true, staff: true },
    });

    if (!dbUser) {
      return NextResponse.json({ synced: 0 });
    }

    const channelIds: string[] = [];

    // ── STUDENT: sync groups they are a member of ──
    if (dbUser.student) {
      const memberships = await prisma.projectgroupmember.findMany({
        where: { studentid: dbUser.student.studentid },
        include: {
          projectgroup: {
            include: {
              projectgroupmember: {
                include: {
                  student: {
                    include: {
                      users: { select: { clerkid: true, name: true } },
                    },
                  },
                },
              },
              staff_projectgroup_convenerstaffidTostaff: {
                include: {
                  users: { select: { clerkid: true, name: true } },
                },
              },
            },
          },
        },
      });

      for (const membership of memberships) {
        const group = membership.projectgroup;
        const channelId = `group-${group.projectgroupid}`;

        // Collect all member Clerk IDs
        const memberClerkIds: string[] = [];

        for (const m of group.projectgroupmember) {
          if (m.student?.users?.clerkid) {
            memberClerkIds.push(m.student.users.clerkid);

            // Upsert Stream user for each member
            await serverClient.upsertUser({
              id: m.student.users.clerkid,
              name: m.student.users.name || m.student.studentname,
            });
          }
        }

        // Add guide/convener faculty
        const guideUser = group.staff_projectgroup_convenerstaffidTostaff;
        if (guideUser?.users?.clerkid) {
          memberClerkIds.push(guideUser.users.clerkid);
          await serverClient.upsertUser({
            id: guideUser.users.clerkid,
            name: guideUser.users.name || guideUser.staffname,
          });
        }

        if (memberClerkIds.length === 0) continue;

        // Create or update the channel
        const channel = serverClient.channel("messaging", channelId, {
          name: group.projecttitle || group.projectgroupname,
          members: memberClerkIds,
          created_by_id: memberClerkIds[0],
        });
        await channel.create();

        channelIds.push(channelId);
      }
    }

    // ── FACULTY: sync groups they are convener/expert of ──
    if (dbUser.staff && (dbUser.role === "FACULTY" || dbUser.role === "ADMIN")) {
      const guidedGroups = await prisma.projectgroup.findMany({
        where: {
          OR: [
            { convenerstaffid: dbUser.staff.staffid },
            { expertstaffid: dbUser.staff.staffid },
          ],
        },
        include: {
          projectgroupmember: {
            include: {
              student: {
                include: {
                  users: { select: { clerkid: true, name: true } },
                },
              },
            },
          },
          staff_projectgroup_convenerstaffidTostaff: {
            include: {
              users: { select: { clerkid: true, name: true } },
            },
          },
          staff_projectgroup_expertstaffidTostaff: {
            include: {
              users: { select: { clerkid: true, name: true } },
            },
          },
        },
      });

      for (const group of guidedGroups) {
        const channelId = `group-${group.projectgroupid}`;
        const memberClerkIds: string[] = [];

        for (const m of group.projectgroupmember) {
          if (m.student?.users?.clerkid) {
            memberClerkIds.push(m.student.users.clerkid);
            await serverClient.upsertUser({
              id: m.student.users.clerkid,
              name: m.student.users.name || m.student.studentname,
            });
          }
        }

        const convener = group.staff_projectgroup_convenerstaffidTostaff;
        if (convener?.users?.clerkid) {
          memberClerkIds.push(convener.users.clerkid);
          await serverClient.upsertUser({
            id: convener.users.clerkid,
            name: convener.users.name || convener.staffname,
          });
        }

        const expert = group.staff_projectgroup_expertstaffidTostaff;
        if (expert?.users?.clerkid) {
          memberClerkIds.push(expert.users.clerkid);
          await serverClient.upsertUser({
            id: expert.users.clerkid,
            name: expert.users.name || expert.staffname,
          });
        }

        // Always include the current user
        if (!memberClerkIds.includes(userId)) {
          memberClerkIds.push(userId);
        }

        if (memberClerkIds.length === 0) continue;

        const channel = serverClient.channel("messaging", channelId, {
          name: group.projecttitle || group.projectgroupname,
          members: memberClerkIds,
          created_by_id: userId,
        });
        await channel.create();

        channelIds.push(channelId);
      }
    }

    // Always ensure user is in the general hub
    const generalChannel = serverClient.channel("messaging", "general-hub", {
      name: "General Hub",
      members: [userId],
      created_by_id: userId,
    });
    await generalChannel.create();
    channelIds.push("general-hub");

    return NextResponse.json({ synced: channelIds.length, channels: channelIds });
  } catch (err) {
    console.error("Chat sync error:", err);
    return NextResponse.json({ error: "Sync failed", detail: String(err) }, { status: 500 });
  }
}
