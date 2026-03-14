import { getUserRole } from '@/app/actions/getUserRole';
import { redirect } from 'next/navigation';
import { StudentNewReportForm } from '@/components/student/StudentNewReportForm';

import { Role } from '@/app/generated/prisma/enums';

export default async function NewReportPage() {
  const userRole = await getUserRole();

  if (!userRole || userRole !== Role.STUDENT) {
    redirect('/check-role');
  }

  return <StudentNewReportForm />;
}
