import { getStudentReportById } from "@/app/actions/reportActions";
import { getUserRole } from "@/app/actions/getUserRole";
import { redirect, notFound } from "next/navigation";
import { ReportDetailView } from "@/components/student/ReportDetailView";

import { Role } from "@/app/generated/prisma/client";  

interface ReportDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const userRole = await getUserRole();

  if (!userRole || userRole !== Role.STUDENT) {
    redirect("/check-role");
  }

  const reportId = parseInt(params.id);
  const report = await getStudentReportById(reportId);

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
