import { getUserRole } from '@/app/actions/getUserRole';
import { StudentReportsContent } from '@/components/student/StudentReportsContent';
import { redirect } from 'next/navigation';
import { Role } from '@/app/generated/prisma/enums';

export default async function ReportsPage() {
  const userRole = await getUserRole();

  if (!userRole || userRole !== Role.STUDENT) {
    redirect('/check-role');
  }

  return <StudentReportsContent />;
}

