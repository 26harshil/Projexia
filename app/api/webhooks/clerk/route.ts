import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { clerkClient, type WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) throw new Error("Missing CLERK_WEBHOOK_SECRET");

  const headerList = await headers();

  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const body = await req.text();

  const wh = new Webhook(secret);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      " -id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Webhook verification failed", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("📥 Received Clerk Webhook Event:", event.type);

  if (event.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = event.data;
    console.log("🛠️ New User Event Data:", { id, email_addresses });

    const email = email_addresses?.[0]?.email_address;
    if (!email) {
      console.error("❌ ABORT: No email found for user ID:", id);
      return new Response("No email found", { status: 400 });
    }

    const name = `${first_name ?? ""} ${last_name ?? ""}`.trim() || "Unknown User";

    try {
      // 1️⃣ Update Clerk Metadata
      console.log("🔄 Step 1: Updating Clerk metadata [role=STUDENT]...");
      const client = await clerkClient();
      await client.users.updateUser(id, {
        publicMetadata: { role: "STUDENT" },
      });
      console.log("✅ Step 1 Success: Clerk metadata set.");

      // 2️⃣ Sync with Database
      console.log("🔄 Step 2: Syncing with Prisma [clerkid:", id, "]...");
      const newUser = await prisma.users.upsert({
        where: { clerkid: id },
        update: {
          email: email,
          name: name
        },
        create: {
          clerkid: id,
          email: email,
          name: name,
          role: "STUDENT", // Direct string to avoid import issues
          isactive: true,
        },
      });

      console.log("✅ Step 2 Success: User synced in DB. Database ID:", newUser.userid);
      return new Response("User synced successfully", { status: 201 });

    } catch (err: any) {
      console.error("❌ CRITICAL ERROR in webhook sync:", err);
      return new Response(`Sync Error: ${err.message}`, { status: 500 });
    }
  }

  return new Response("Webhook received but not processed", { status: 200 });
}


