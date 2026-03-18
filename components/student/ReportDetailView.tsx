'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';

interface Report {
  reportid: number;
  reporttitle: string;
  reporttype: string;
  status: string;
  reviewcomments: string | null;
  created: Date;
  modified: Date | null;
  reviewedat: Date | null;
  projectfile: {
    fileid: number;
    filename: string;
    fileurl: string;
    filetype: string;
    filesize: number | null;
  } | null;
  projectgroup: {
    projectgroupid: number;
    projectgroupname: string;
    projecttitle: string | null;
  };
  staff: {
    staffid: number;
    staffname: string;
    email: string | null;
  } | null;
}

interface ReportDetailViewProps {
  report: Report;
}

export function ReportDetailView({ report }: ReportDetailViewProps) {
  const statusLabelMap: Record<string, string> = {
    PENDING: 'Pending review by faculty',
    ACCEPTED: 'Accepted by faculty',
    DECLINED: 'Declined by faculty',
  };

  const formatStatusLabel = (status: string) => statusLabelMap[status] ?? status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-400/40' };
      case 'DECLINED':
        return { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-400/40' };
      case 'PENDING':
        return { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-400/40' };
      default:
        return { bg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-400/40' };
    }
  };

  const statusColors = getStatusColor(report.status);
  const reportDate = new Date(report.created);
  const reviewDate = report.reviewedat ? new Date(report.reviewedat) : null;
  const glassPanel =
    'rounded-2xl border border-[#3B9EFF33] bg-[#0A1428CC] backdrop-blur-xl shadow-[0_10px_35px_rgba(0,198,255,0.12)]';
  const labelClass = 'mb-1 text-xs font-semibold uppercase tracking-wide text-[#8BA0BF]';
  const valueClass = 'text-[#E8EDF5]';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#050A14_0%,#07111F_45%,#050A14_100%)] p-4 md:p-8">
      <div className="pointer-events-none absolute left-1/3 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[90px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-blue-500/10 blur-[90px]" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className={`${glassPanel} mb-6 flex items-center gap-4 p-5`}>
          <Link href="/student/reports">
            <Button
              variant="outline"
              size="icon"
              className="border-[#3B9EFF66] bg-[#091325] text-[#BFD7F6] hover:bg-[#102341] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              {report.reporttitle}
            </h1>
            <p className="mt-1 text-sm text-[#8BA0BF]">{report.projectgroup.projectgroupname}</p>
          </div>
          <Badge className={`shrink-0 border px-3 py-2 text-sm md:text-base ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
            {formatStatusLabel(report.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Information */}
            <Card className={glassPanel}>
              <CardHeader>
                <CardTitle className="text-[#E8EDF5]">Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className={labelClass}>Report Type</p>
                  <p className={`${valueClass} capitalize`}>{report.reporttype}</p>
                </div>
                <div>
                  <p className={labelClass}>Submitted On</p>
                  <p className={valueClass}>{reportDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                {report.modified && (
                  <div>
                    <p className={labelClass}>Last Updated</p>
                    <p className={valueClass}>{new Date(report.modified).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attached File */}
            {report.projectfile && (
              <Card className={glassPanel}>
                <CardHeader>
                  <CardTitle className="text-[#E8EDF5]">Attached File</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={report.projectfile.fileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#3B9EFF55] bg-[#0F2344AA] p-4 transition-all hover:border-cyan-300/50 hover:bg-[#12305ECC]"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-3xl">
                        {report.projectfile.filetype.includes('pdf') ? '📄' :
                          report.projectfile.filetype.includes('image') ? '🖼️' : '📑'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-semibold text-[#E8EDF5]">
                          {report.projectfile.filename}
                        </p>
                        <p className="text-sm text-[#8BA0BF]">
                          {report.projectfile.filesize
                            ? `${(report.projectfile.filesize / 1024 / 1024).toFixed(2)} MB`
                            : 'Size unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <Download className="h-5 w-5 text-cyan-300" />
                      <ExternalLink className="h-5 w-5 text-cyan-300" />
                    </div>
                  </a>
                  {report.projectfile.filetype.includes('image') && (
                    <img
                      src={report.projectfile.fileurl}
                      alt={report.projectfile.filename}
                      className="mt-3 max-h-64 w-full rounded-lg border border-[#3B9EFF44] bg-[#050A14] object-contain"
                    />
                  )}
                  {report.projectfile.filetype.includes('pdf') && (
                    <p className="mt-3 rounded border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200">
                      PDF shared. Use the file link above to open or download it.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Review Status - only show if reviewed */}
            {report.status !== 'PENDING' && (
              <Card className={`${glassPanel} border-l-4 ${statusColors.border}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#E8EDF5]">
                    <span>Review Status</span>
                    <Badge className={statusColors.bg + ' ' + statusColors.text}>
                      {formatStatusLabel(report.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.staff && (
                    <div>
                      <p className={labelClass}>Reviewed By</p>
                      <p className={valueClass}>{report.staff.staffname}</p>
                      {report.staff.email && (
                        <p className="text-sm text-[#8BA0BF]">{report.staff.email}</p>
                      )}
                    </div>
                  )}
                  {reviewDate && (
                    <div>
                      <p className={labelClass}>Review Date</p>
                      <p className={valueClass}>{reviewDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  {report.reviewcomments && (
                    <div>
                      <p className={labelClass}>Feedback</p>
                      <div className={`rounded-lg border-l-4 p-4 ${statusColors.border} ${statusColors.bg}`}>
                        <p className="whitespace-pre-wrap text-[#E8EDF5]">{report.reviewcomments}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Details */}
            <Card className={glassPanel}>
              <CardHeader>
                <CardTitle className="text-lg text-[#E8EDF5]">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className={labelClass}>Group Name</p>
                  <p className={valueClass}>{report.projectgroup.projectgroupname}</p>
                </div>
                {report.projectgroup.projecttitle && (
                  <div>
                    <p className={labelClass}>Project Title</p>
                    <p className={valueClass}>{report.projectgroup.projecttitle}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card className={glassPanel}>
              <CardHeader>
                <CardTitle className="text-lg text-[#E8EDF5]">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="mt-1.5 h-4 w-4 rounded-full bg-cyan-400" />
                      <div className="h-12 w-0.5 bg-[#3B9EFF55]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#E8EDF5]">Submitted</p>
                      <p className="text-sm text-[#8BA0BF]">
                        {reportDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-4 w-4 rounded-full ${report.status !== 'PENDING' ? 'bg-emerald-400' : 'bg-[#8BA0BF66]'
                        }`} />
                    </div>
                    <div>
                      <p className="font-medium text-[#E8EDF5]">
                        {report.status === 'PENDING' ? 'Awaiting Review' : 'Review Complete'}
                      </p>
                      <p className="text-sm text-[#8BA0BF]">
                        {report.status === 'PENDING'
                          ? 'Your report is being reviewed by faculty'
                          : `Reviewed on ${reviewDate?.toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {/* {report.status === 'PENDING' && (
              <Card className={glassPanel}>
                <CardContent className="pt-6">
                  <p className="mb-4 text-sm text-[#8BA0BF]">
                    Your report is pending review. You can edit or delete it until faculty reviews it.
                  </p>
                  <div className="flex flex-col gap-2">

                    <Button variant="destructive" className="w-full bg-[#B3264A] text-white hover:bg-[#9F2142]">
                      Delete Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
