// /app/student/project/page.tsx
import { getStudentProjectGroups } from "@/app/actions/studentActions";
import ProjectContent from "@/components/student/ProjectContent";

export default async function ProjectPage() {
  let projectGroups = [];
  let error = null;

  try {
    projectGroups = await getStudentProjectGroups();
  } catch (err) {
    error = (err as Error).message;
  }

  return <ProjectContent projectGroups={projectGroups} error={error} />;
}