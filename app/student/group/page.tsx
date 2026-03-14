// /app/student/group/page.tsx
import { getStudentProjectGroups } from "@/app/actions/studentActions";
import GroupContent from "@/components/student/GroupContent";


export default async function GroupPage() {
  let projectGroups = [];
  let error = null;

  try {
    projectGroups = await getStudentProjectGroups();
  } catch (err) {
    error = (err as Error).message;
  }

  return <GroupContent projectGroups={projectGroups} error={error} />;
}