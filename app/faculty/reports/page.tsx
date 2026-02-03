// /app/faculty/reports/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getFacultyReports } from "@/app/actions/getFacultyData";
import { FacultyReportsContent } from "@/components/faculty/FacultyReportsContent";

export default async function ReportsPage() {
  const role = await getUserRole();

  if (!role || role !== "FACULTY") {
    redirect("/");
  }

  const reports = await getFacultyReports();

  return <FacultyReportsContent reports={reports} />;
}