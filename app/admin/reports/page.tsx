// /app/admin/reports/page.tsx
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/actions/getUserRole";
import { getReportStats } from "@/app/actions/adminActions";
import { AdminReportsContent } from "@/components/admin/AdminReportsContent";

export default async function ReportsPage() {
  const role = await getUserRole();

  if (role !== "ADMIN") {
    redirect("/");
  }

  const reportStats = await getReportStats();

  return <AdminReportsContent stats={reportStats} />;
}