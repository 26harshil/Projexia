import { getUserRole } from '@/app/actions/getUserRole';
import { Role } from '@/app/generated/prisma/client';
import { StudentReportsContent } from '@/components/student/StudentReportsContent';
import { redirect } from 'next/navigation';

export default async function ReportsPage() {
  const userRole = await getUserRole();

  if (!userRole || userRole !== Role.STUDENT) {
    redirect('/check-role');
  }

  return <StudentReportsContent />;
}

