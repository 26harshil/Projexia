import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getStudentMeetings } from "@/app/actions/studentActions";
import { StudentMeetingsContent } from "@/components/student/StudentMeetingsContent";

export default async function MeetingsPage() {
  const role = await getUserRole();

  if (role && role !== "STUDENT") {
    redirect(`/${role.toLowerCase()}/dashboard`);
  }

  const meetingsData = await getStudentMeetings();

  return (
    <StudentMeetingsContent meetings={meetingsData} />
  );
}