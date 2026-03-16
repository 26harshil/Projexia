import { serverClient } from "./stream";

// ---------------------------------------------------------------------------
// Channel ID helpers
// ---------------------------------------------------------------------------

/**
 * Returns a deterministic, Stream-safe channel ID for a project group.
 * Stream channel IDs: max 64 chars, only [a-z0-9_-] allowed.
 */
export function getGroupChannelId(groupId: number): string {
  return `project-group-${groupId}`;
}

/**
 * Builds the human-readable channel name shown in the sidebar.
 * Format: "<groupName> — <projectTitle>"  (title is optional)
 */
export function getGroupChannelName(
  groupName: string,
  projectTitle?: string | null,
): string {
  return projectTitle ? `${groupName} — ${projectTitle}` : groupName;
}

// ---------------------------------------------------------------------------
// Core channel operations
// ---------------------------------------------------------------------------

/**
 * Creates (or idempotently updates) a Stream Chat channel for a project group.
 *
 * - Safe to call multiple times — Stream's create is idempotent.
 * - Upserts every member so Stream knows about them before adding.
 * - Adds ALL members (faculty + students) in one batch call.
 *
 * @param groupId         DB primary key of the project group
 * @param groupName       Group name (used in channel display name)
 * @param projectTitle    Project title (optional, appended to channel name)
 * @param createdByClerkId  Clerk user ID of the faculty who owns the group
 * @param memberClerkIds  Clerk user IDs of all students in the group
 */
export async function ensureGroupChannel({
  groupId,
  groupName,
  projectTitle,
  createdByClerkId,
  memberClerkIds,
}: {
  groupId: number;
  groupName: string;
  projectTitle?: string | null;
  createdByClerkId: string;
  memberClerkIds: string[];
}): Promise<void> {
  const channelId = getGroupChannelId(groupId);
  const channelName = getGroupChannelName(groupName, projectTitle);

  // Deduplicate: faculty + students
  const allMembers = [...new Set([createdByClerkId, ...memberClerkIds])];

  // Upsert all participants in Stream so they exist before being added
  if (allMembers.length > 0) {
    await serverClient.upsertUsers(
      allMembers.map((id) => ({ id, role: "user" })),
    );
  }

  // Build the channel reference with metadata
  const channel = serverClient.channel("messaging", channelId, {
    name: channelName,
    created_by_id: createdByClerkId,
  });

  // create() is idempotent — won't error if the channel already exists
  await channel.create();

  // Add all members so they get the channel_member role → ReadChannel allowed
  await channel.addMembers(allMembers);
}

/**
 * Adds a single user (by Clerk ID) to an existing group channel.
 * Upserts the user first so Stream recognises them.
 *
 * Call this after inserting a new projectgroupmember row in the DB.
 */
export async function addMemberToGroupChannel(
  groupId: number,
  clerkId: string,
  displayName?: string,
): Promise<void> {
  // Make sure Stream knows about this user
  await serverClient.upsertUser({
    id: clerkId,
    role: "user",
    name: displayName ?? clerkId,
  });

  const channelId = getGroupChannelId(groupId);
  const channel = serverClient.channel("messaging", channelId);
  await channel.addMembers([clerkId]);
}

/**
 * Removes a single user (by Clerk ID) from a group channel.
 *
 * Call this after deleting a projectgroupmember row from the DB.
 */
export async function removeMemberFromGroupChannel(
  groupId: number,
  clerkId: string,
): Promise<void> {
  const channelId = getGroupChannelId(groupId);
  const channel = serverClient.channel("messaging", channelId);
  await channel.removeMembers([clerkId]);
}

/**
 * Renames an existing group channel (e.g. when the faculty updates the project
 * title or group name).
 */
export async function renameGroupChannel(
  groupId: number,
  groupName: string,
  projectTitle?: string | null,
): Promise<void> {
  const channelId = getGroupChannelId(groupId);
  const channelName = getGroupChannelName(groupName, projectTitle);
  const channel = serverClient.channel("messaging", channelId);
  await channel.update({ name: channelName });
}

// ---------------------------------------------------------------------------
// Stream-resilient wrapper
// ---------------------------------------------------------------------------

/**
 * Wraps any Stream API call so it never throws / never blocks the caller.
 * On failure it logs a warning and resolves with `undefined`.
 *
 * Usage:
 *   await silentStreamOp(() => ensureGroupChannel({ ... }));
 */
export async function silentStreamOp<T>(
  op: () => Promise<T>,
  label = "Stream op",
): Promise<T | undefined> {
  try {
    return await op();
  } catch (err: any) {
    console.warn(
      `[streamGroupChat] ${label} failed (non-fatal):`,
      err?.message ?? err,
    );
    return undefined;
  }
}
