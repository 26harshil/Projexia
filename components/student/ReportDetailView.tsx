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
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
      case 'DECLINED':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' };
    }
  };

  const statusColors = getStatusColor(report.status);
  const reportDate = new Date(report.created);
  const reviewDate = report.reviewedat ? new Date(report.reviewedat) : null;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/student/reports">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{report.reporttitle}</h1>
            <p className="text-gray-500 mt-1">{report.projectgroup.projectgroupname}</p>
          </div>
          <Badge className={`shrink-0 text-lg py-2 px-3 ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
            {formatStatusLabel(report.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Report Information */}
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Report Type</p>
                  <p className="text-gray-900 capitalize">{report.reporttype}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Submitted On</p>
                  <p className="text-gray-900">{reportDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
                {report.modified && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Last Updated</p>
                    <p className="text-gray-900">{new Date(report.modified).toLocaleDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attached File */}
            {report.projectfile && (
              <Card>
                <CardHeader>
                  <CardTitle>Attached File</CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href={report.projectfile.fileurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-3xl">
                        {report.projectfile.filetype.includes('pdf') ? '📄' : 
                         report.projectfile.filetype.includes('image') ? '🖼️' : '📑'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {report.projectfile.filename}
                        </p>
                        <p className="text-sm text-gray-500">
                          {report.projectfile.filesize 
                            ? `${(report.projectfile.filesize / 1024 / 1024).toFixed(2)} MB`
                            : 'Size unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <Download className="h-5 w-5 text-blue-600" />
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                    </div>
                  </a>
                  {report.projectfile.filetype.includes('image') && (
                    <img
                      src={report.projectfile.fileurl}
                      alt={report.projectfile.filename}
                      className="mt-3 max-h-64 w-full object-contain rounded-lg border bg-white"
                    />
                  )}
                  {report.projectfile.filetype.includes('pdf') && (
                    <p className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded px-3 py-2">
                      PDF shared. Use the file link above to open or download it.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Review Status - only show if reviewed */}
            {report.status !== 'PENDING' && (
              <Card className={`border-l-4 ${statusColors.border}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>Review Status</span>
                    <Badge className={statusColors.bg + ' ' + statusColors.text}>
                      {formatStatusLabel(report.status)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {report.staff && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Reviewed By</p>
                      <p className="text-gray-900">{report.staff.staffname}</p>
                      {report.staff.email && (
                        <p className="text-sm text-gray-500">{report.staff.email}</p>
                      )}
                    </div>
                  )}
                  {reviewDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Review Date</p>
                      <p className="text-gray-900">{reviewDate.toLocaleDateString()}</p>
                    </div>
                  )}
                  {report.reviewcomments && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Feedback</p>
                      <div className={`p-4 rounded-lg border-l-4 ${statusColors.border} ${statusColors.bg}`}>
                        <p className="text-gray-900 whitespace-pre-wrap">{report.reviewcomments}</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Group Name</p>
                  <p className="text-gray-900">{report.projectgroup.projectgroupname}</p>
                </div>
                {report.projectgroup.projecttitle && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Project Title</p>
                    <p className="text-gray-900">{report.projectgroup.projecttitle}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-blue-600 mt-1.5" />
                      <div className="w-0.5 h-12 bg-gray-200" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-500">
                        {reportDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        report.status !== 'PENDING' ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {report.status === 'PENDING' ? 'Awaiting Review' : 'Review Complete'}
                      </p>
                      <p className="text-sm text-gray-500">
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
            {report.status === 'PENDING' && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Your report is pending review. You can edit or delete it until faculty reviews it.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" className="w-full">
                      Edit Report
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Delete Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
