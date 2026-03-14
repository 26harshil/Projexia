'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { ReportStatus } from '@/app/generated/prisma/enums';

async function getCurrentStudentId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const dbUser = await prisma.users.findUnique({
    where: { clerkid: userId },
    select: {
      student: {
        select: {
          studentid: true,
        },
      },
    },
  });

  if (!dbUser?.student) {
    throw new Error('Student record not found');
  }

  return dbUser.student.studentid;
}

// Get all reports for a specific student
export async function getStudentReports(studentId?: number) {
  try {
    const resolvedStudentId = studentId ?? (await getCurrentStudentId());

    const reports = await prisma.projectreport.findMany({
      where: { studentid: resolvedStudentId },
      include: {
        projectfile: true,
        projectgroup: {
          select: {
            projectgroupid: true,
            projectgroupname: true,
            projecttitle: true,
          },
        },
        staff: {
          select: {
            staffid: true,
            staffname: true,
            email: true,
          },
        },
      },
      orderBy: { created: 'desc' },
    });
    return reports;
  } catch (error) {
    console.error('Error fetching student reports:', error);
    throw error;
  }
}

// Get reports for a specific project group
export async function getProjectGroupReports(projectGroupId: number) {
  try {
    const reports = await prisma.projectreport.findMany({
      where: { projectgroupid: projectGroupId },
      include: {
        projectfile: true,
        student: {
          select: {
            studentid: true,
            studentname: true,
            email: true,
          },
        },
        staff: {
          select: {
            staffid: true,
            staffname: true,
            email: true,
          },
        },
      },
      orderBy: { created: 'desc' },
    });
    return reports;
  } catch (error) {
    console.error('Error fetching project group reports:', error);
    throw error;
  }
}

// Create a new report
export async function createReport(data: {
  fileid?: number;
  projectgroupid: number;
  studentid?: number;
  reporttitle: string;
  reporttype: string; // proposal, midterm, final
  description?: string;
}) {
  try {
    const resolvedStudentId = data.studentid ?? (await getCurrentStudentId());

    const report = await prisma.projectreport.create({
      data: {
        fileid: data.fileid,
        projectgroupid: data.projectgroupid,
        studentid: resolvedStudentId,
        reporttitle: data.reporttitle,
        reporttype: data.reporttype,
        status: 'PENDING', // Default status
      },
      include: {
        projectfile: true,
        projectgroup: true,
        student: true,
      },
    });
    return report;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
}

// Update report status (by faculty)
export async function updateReportStatus(
  reportId: number,
  status: ReportStatus,
  reviewComments?: string,
  reviewedById?: number
) {
  try {
    const report = await prisma.projectreport.update({
      where: { reportid: reportId },
      data: {
        status,
        reviewcomments: reviewComments || null,
        reviewedby: reviewedById || null,
        reviewedat: new Date(),
        modified: new Date(),
      },
      include: {
        projectfile: true,
        projectgroup: true,
        student: true,
        staff: true,
      },
    });
    return report;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

// Get report by ID
export async function getReportById(reportId: number) {
  try {
    const report = await prisma.projectreport.findUnique({
      where: { reportid: reportId },
      include: {
        projectfile: true,
        projectgroup: true,
        student: true,
        staff: true,
      },
    });
    return report;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
}

// Get a report by id only if it belongs to current student
export async function getStudentReportById(reportId: number) {
  try {
    const studentId = await getCurrentStudentId();

    const report = await prisma.projectreport.findFirst({
      where: {
        reportid: reportId,
        studentid: studentId,
      },
      include: {
        projectfile: true,
        projectgroup: true,
        student: true,
        staff: true,
      },
    });

    return report;
  } catch (error) {
    console.error('Error fetching student report by id:', error);
    throw error;
  }
}

// Delete a report
export async function deleteReport(reportId: number) {
  try {
    const report = await prisma.projectreport.delete({
      where: { reportid: reportId },
    });
    return report;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
}

// Get report statistics for a student
export async function getReportStats(studentId: number) {
  try {
    const resolvedStudentId = studentId ?? (await getCurrentStudentId());

    const stats = await prisma.projectreport.groupBy({
      by: ['status'],
      where: { studentid: resolvedStudentId },
      _count: {
        reportid: true,
      },
    });
    return stats;
  } catch (error) {
    console.error('Error fetching report stats:', error);
    throw error;
  }
}

// Get project groups available to the current student for report submission
export async function getCurrentStudentProjectGroups() {
  try {
    const studentId = await getCurrentStudentId();

    const memberships = await prisma.projectgroupmember.findMany({
      where: { studentid: studentId },
      select: {
        projectgroup: {
          select: {
            projectgroupid: true,
            projectgroupname: true,
          },
        },
      },
      orderBy: {
        projectgroup: {
          projectgroupname: 'asc',
        },
      },
    });

    return memberships.map((m) => m.projectgroup);
  } catch (error) {
    console.error('Error fetching current student project groups:', error);
    throw error;
  }
}

// Save uploaded file metadata and return created file record
export async function createProjectFile(data: {
  filename: string;
  fileurl: string;
  filetype: string;
  filesize?: number;
  projectgroupid?: number;
}) {
  try {
    const studentId = await getCurrentStudentId();

    return await prisma.projectfile.create({
      data: {
        filename: data.filename,
        fileurl: data.fileurl,
        filetype: data.filetype,
        filesize: data.filesize,
        projectgroupid: data.projectgroupid,
        studentid: studentId,
      },
    });
  } catch (error) {
    console.error('Error creating project file record:', error);
    throw error;
  }
}
