// /app/faculty/group/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getFacultyGroups, getAvailableStudents, getProjectTypes, getAllStaff } from "@/app/actions/getFacultyData";
import { FacultyGroupsContent } from "@/components/faculty/FacultyGroupsContent";

export default async function GroupsPage() {
  const role = await getUserRole();

  if (!role || role !== "FACULTY") {
    redirect("/");
  }

  const [groups, students, projectTypes, staffList] = await Promise.all([
    getFacultyGroups(),
    getAvailableStudents(),
    getProjectTypes(),
    getAllStaff(),
  ]);

  return (
    <FacultyGroupsContent
      groups={groups}
      students={students}
      projectTypes={projectTypes}
      staffList={staffList}
    />
  );
}