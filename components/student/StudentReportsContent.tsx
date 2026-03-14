'use client';

import { useEffect, useState } from 'react';
import { getStudentReports } from '@/app/actions/reportActions';
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

interface Report {
  reportid: number;
  reporttitle: string;
  reporttype: string;
  status: string;
  reviewcomments: string | null;
  created: Date;
  modified: Date | null;
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

export function StudentReportsContent() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getStudentReports();
        setReports(data as Report[]);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const statusLabelMap: Record<string, string> = {
    PENDING: 'Pending review by faculty',
    ACCEPTED: 'Accepted by faculty',
    DECLINED: 'Declined by faculty',
  };

  const formatStatusLabel = (status: string) => statusLabelMap[status] ?? status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'DECLINED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (filetype: string) => {
    if (filetype.includes('pdf')) {
      return '📄';
    } else if (filetype.includes('image')) {
      return '🖼️';
    } else if (filetype.includes('document') || filetype.includes('word')) {
      return '📑';
    }
    return '📎';
  };

  const filteredReports = reports.filter((report) => {
    if (filter === 'ALL') return true;
    return report.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Reports</h1>
          <p className="text-gray-500">
            Manage your project reports and track their acceptance status
          </p>
        </div>
        <Link href="/student/reports/new">
          <Button>Submit New Report</Button>
        </Link>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'PENDING', 'ACCEPTED', 'DECLINED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'All' : formatStatusLabel(status)}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <Card>
          <CardContent className="pt-16 text-center pb-16">
            <p className="text-gray-500 mb-4">No reports found</p>
            <Link href="/student/reports/new">
              <Button variant="outline">Submit Your First Report</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report) => (
            <Card key={report.reportid} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">
                      {report.reporttitle}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {report.projectgroup.projectgroupname}
                    </CardDescription>
                  </div>
                  <Badge className={`shrink-0 ${getStatusColor(report.status)}`}>
                    {formatStatusLabel(report.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Report Type */}
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Type</p>
                  <p className="text-sm capitalize">{report.reporttype}</p>
                </div>

                {/* Attached File */}
                {report.projectfile && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Shared File</p>
                    <a
                      href={report.projectfile.fileurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-xl">{getFileIcon(report.projectfile.filetype)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {report.projectfile.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {report.projectfile.filesize
                            ? `${(report.projectfile.filesize / 1024).toFixed(2)} KB`
                            : 'No size'}
                        </p>
                      </div>
                      <span className="text-lg">↗</span>
                    </a>
                    {report.projectfile.filetype.includes('image') && (
                      <img
                        src={report.projectfile.fileurl}
                        alt={report.projectfile.filename}
                        className="mt-2 h-32 w-full object-cover rounded-lg border"
                      />
                    )}
                    {report.projectfile.filetype.includes('pdf') && (
                      <p className="mt-2 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded px-2 py-1">
                        PDF shared. Click the file card above to open.
                      </p>
                    )}
                  </div>
                )}

                {!report.projectfile && (
                  <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
                    No file shared with this report.
                  </p>
                )}

                {/* Reviewer Comments */}
                {report.reviewcomments && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Feedback</p>
                    <p className="text-sm bg-blue-50 p-2 rounded border-l-2 border-blue-300">
                      {report.reviewcomments}
                    </p>
                  </div>
                )}

                {/* Reviewed By */}
                {report.staff && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Reviewed By</p>
                    <p className="text-sm">{report.staff.staffname}</p>
                  </div>
                )}

                {/* Dates */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Submitted</span>
                    <span className="font-medium">
                      {new Date(report.created).toLocaleDateString()}
                    </span>
                  </div>
                  {report.modified && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Last Updated</span>
                      <span className="font-medium">
                        {new Date(report.modified).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/student/reports/${report.reportid}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  {report.status === 'PENDING' && (
                    <Button size="sm" variant="secondary" className="flex-1">
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
