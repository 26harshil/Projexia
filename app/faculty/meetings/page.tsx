// /app/faculty/meetings/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getFacultyMeetings, getFacultyGroups } from "@/app/actions/getFacultyData";
import { FacultyMeetingsContent } from "@/components/faculty/FacultyMeetingsContent";

export default async function MeetingsPage() {
  const role = await getUserRole();

  if (!role || role !== "FACULTY") {
    redirect("/");
  }

  const [meetings, groups] = await Promise.all([
    getFacultyMeetings(),
    getFacultyGroups(),
  ]);

  return <FacultyMeetingsContent meetings={meetings} groups={groups} />;
}