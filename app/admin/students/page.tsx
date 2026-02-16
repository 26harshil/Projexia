// /app/admin/students/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getAllStudents, getStudentStats } from "@/app/actions/adminActions";
import { AdminStudentsContent } from "@/components/admin/AdminStudentsContent";

export default async function StudentsPage() {
  const role = await getUserRole();

  if (role !== "ADMIN") {
    redirect("/");
  }

  const [students, stats] = await Promise.all([
    getAllStudents(),
    getStudentStats(),
  ]);

  return <AdminStudentsContent initialStudents={students} initialStats={stats} />;
}
