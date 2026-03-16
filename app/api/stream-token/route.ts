import "server-only";
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { serverClient } from "@/lib/stream";
import { prisma } from "@/lib/prisma";
import { getGroupChannelId } from "@/lib/streamGroupChat";

export async function POST() {
  try {
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const userName =
      user?.fullName ||
      user?.firstName ||
      user?.emailAddresses[0]?.emailAddress ||
      "User";

    // ── 2. Upsert user + set up channels in Stream ───────────────────────────
    // Wrapped in try/catch so an ENOTFOUND / timeout never returns HTTP 500.
    // The token below is always generated locally (pure JWT — no HTTP call).
    try {
      // Register / update the user in Stream
      await serverClient.upsertUser({
        id: userId,
        role: "user",
        name: userName,
        image: user?.imageUrl ?? undefined,
      });

      // Create the catch-all General Hub and add this user
      const generalChannel = serverClient.channel("messaging", "general-hub", {
        name: "General Hub",
        created_by_id: userId,
      });
      await generalChannel.create();
      await generalChannel.addMembers([userId]);

      // ── 3. Sync project-group channels from the database ─────────────────
      const dbUser = await prisma.users.findUnique({
        where: { clerkid: userId },
        select: {
          student: { select: { studentid: true } },
          staff: { select: { staffid: true } },
        },
      });

      if (dbUser?.student) {
        // Student → add to every group they are a member of
        const memberships = await prisma.projectgroupmember.findMany({
          where: { studentid: dbUser.student.studentid },
          include: {
            projectgroup: {
              select: {
                projectgroupid: true,
                projectgroupname: true,
                projecttitle: true,
              },
            },
          },
        });

        for (const m of memberships) {
          try {
            const ch = serverClient.channel(
              "messaging",
              getGroupChannelId(m.projectgroup.projectgroupid),
              {
                name: m.projectgroup.projecttitle
                  ? `${m.projectgroup.projectgroupname} — ${m.projectgroup.projecttitle}`
                  : m.projectgroup.projectgroupname,
                created_by_id: userId,
              },
            );
            await ch.create();
            await ch.addMembers([userId]);
          } catch {
            // Channel may not exist yet — skip silently
          }
        }
      }

      if (dbUser?.staff) {
        // Faculty → add to every group they convene or are expert for
        const groups = await prisma.projectgroup.findMany({
          where: {
            OR: [
              { convenerstaffid: dbUser.staff.staffid },
              { expertstaffid: dbUser.staff.staffid },
            ],
          },
          select: {
            projectgroupid: true,
            projectgroupname: true,
            projecttitle: true,
          },
        });

        for (const g of groups) {
          try {
            const ch = serverClient.channel(
              "messaging",
              getGroupChannelId(g.projectgroupid),
              {
                name: g.projecttitle
                  ? `${g.projectgroupname} — ${g.projecttitle}`
                  : g.projectgroupname,
                created_by_id: userId,
              },
            );
            await ch.create();
            await ch.addMembers([userId]);
          } catch {
            // Skip silently
          }
        }
      }
    } catch (streamErr: any) {
      // Non-fatal — log and continue to token generation
      console.warn(
        "[stream-token] Stream setup error (non-fatal):",
        streamErr?.message ?? streamErr,
      );
    }

    // ── 4. Generate token (local JWT — never throws ENOTFOUND) ───────────────
    const token = serverClient.createToken(userId);

    return NextResponse.json({ token });
  } catch (err: any) {
    console.error("[stream-token] Fatal error:", err);
    return NextResponse.json(
      { error: err?.message || "Token creation failed" },
      { status: 500 },
    );
  }
}
