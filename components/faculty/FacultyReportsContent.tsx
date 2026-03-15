"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileText,
  Search,
  User,
  XCircle,
  Download,
} from "lucide-react";
import { reviewFacultyProposalReport } from "@/app/actions/getFacultyData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProposalStatus = "PENDING" | "ACCEPTED" | "DECLINED";

interface ProposalFile {
  fileId: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number | null;
}

interface ProposalReport {
  reportId: number;
  reportTitle: string;
  reportType: string;
  status: ProposalStatus;
  reviewComments: string | null;
  reviewedAt: string | Date | null;
  reviewedByName: string | null;
  created: string | Date;
  studentId: number;
  studentName: string;
  studentEmail: string | null;
  file: ProposalFile | null;
}

interface GroupReport {
  groupId: number;
  groupName: string;
  projectTitle: string | null;
  leaderName: string | null;
  memberCount: number;
  totalMeetings: number;
  completedMeetings: number;
  pendingMeetings: number;
  meetings: Array<unknown>;
  proposalReports: ProposalReport[];
}

interface FacultyReportsContentProps {
  reports: GroupReport[];
}

interface FlatProposal extends ProposalReport {
  groupId: number;
  groupName: string;
  projectTitle: string | null;
}

const statusStyles: Record<ProposalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  DECLINED: "bg-red-100 text-red-700",
};

export function FacultyReportsContent({ reports }: FacultyReportsContentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | ProposalStatus>("ALL");
  const [reviewingReportId, setReviewingReportId] = useState<number | null>(null);
  const [feedbackByReport, setFeedbackByReport] = useState<Record<number, string>>({});
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const proposals = useMemo<FlatProposal[]>(() => {
    return reports.flatMap((group) =>
      (group.proposalReports || []).map((proposal) => ({
        ...proposal,
        groupId: group.groupId,
        groupName: group.groupName,
        projectTitle: group.projectTitle,
      }))
    );
  }, [reports]);

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        proposal.reportTitle.toLowerCase().includes(normalizedQuery) ||
        proposal.studentName.toLowerCase().includes(normalizedQuery) ||
        proposal.groupName.toLowerCase().includes(normalizedQuery) ||
        (proposal.projectTitle || "").toLowerCase().includes(normalizedQuery);

      const matchesStatus = statusFilter === "ALL" || proposal.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proposals, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    const pending = proposals.filter((p) => p.status === "PENDING").length;
    const accepted = proposals.filter((p) => p.status === "ACCEPTED").length;
    const declined = proposals.filter((p) => p.status === "DECLINED").length;
    return {
      total: proposals.length,
      pending,
      accepted,
      declined,
    };
  }, [proposals]);

  const updateProposalStatus = async (
    proposal: FlatProposal,
    status: "ACCEPTED" | "DECLINED"
  ) => {
    setActionError("");
    setActionSuccess("");

    const feedback = feedbackByReport[proposal.reportId] || "";
    if (status === "DECLINED" && !feedback.trim()) {
      setActionError("Please add feedback before rejecting a proposal.");
      return;
    }

    setReviewingReportId(proposal.reportId);
    const result = await reviewFacultyProposalReport({
      reportId: proposal.reportId,
      status,
      feedback,
    });

    if (!result.success) {
      setActionError(result.error || "Could not review the proposal.");
      setReviewingReportId(null);
      return;
    }

    setActionSuccess(
      status === "ACCEPTED"
        ? "Proposal approved successfully."
        : "Proposal rejected with feedback."
    );
    setReviewingReportId(null);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Faculty Reports</h1>
          <p className="mt-1 text-slate-500">
            Proposal submissions from students in your assigned project groups.
          </p>
        </motion.div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Proposals" value={counts.total} icon={<FileText className="h-4 w-4" />} />
          <StatCard label="Pending" value={counts.pending} icon={<Clock className="h-4 w-4" />} />
          <StatCard label="Approved" value={counts.accepted} icon={<CheckCircle2 className="h-4 w-4" />} />
          <StatCard label="Rejected" value={counts.declined} icon={<XCircle className="h-4 w-4" />} />
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by report, student, group, or project"
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["ALL", "PENDING", "ACCEPTED", "DECLINED"].map((status) => (
                <Button
                  key={status}
                  type="button"
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status as "ALL" | ProposalStatus)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {actionError && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {actionError}
          </div>
        )}
        {actionSuccess && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            {actionSuccess}
          </div>
        )}

        {filteredProposals.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            No proposal reports found for your current filters.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => {
              const feedbackValue = feedbackByReport[proposal.reportId] ?? proposal.reviewComments ?? "";
              return (
                <div
                  key={proposal.reportId}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{proposal.reportTitle}</h3>
                      <p className="text-sm text-slate-500">
                        {proposal.projectTitle || proposal.groupName}
                      </p>
                    </div>
                    <Badge className={statusStyles[proposal.status]}>{proposal.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm text-slate-600 md:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      {proposal.studentName} ({proposal.studentId})
                    </p>
                    <p>
                      Submitted: {new Date(proposal.created).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                    {proposal.reviewedAt && (
                      <p>
                        Reviewed: {new Date(proposal.reviewedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    )}
                    {proposal.reviewedByName && <p>Reviewed By: {proposal.reviewedByName}</p>}
                  </div>

                  {proposal.file && (
                    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                      {(() => {
                        const downloadHref = `/api/download?url=${encodeURIComponent(
                          proposal.file.fileUrl
                        )}&filename=${encodeURIComponent(proposal.file.fileName)}`;
                        return (
                          <a
                            href={downloadHref}
                            download={proposal.file.fileName}
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4" />
                            {proposal.file.fileName}
                          </a>
                        );
                      })()}
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Feedback {proposal.status === "DECLINED" ? "(Required for rejection)" : "(Optional for approval)"}
                    </label>
                    <textarea
                      value={feedbackValue}
                      onChange={(e) =>
                        setFeedbackByReport((prev) => ({
                          ...prev,
                          [proposal.reportId]: e.target.value,
                        }))
                      }
                      placeholder="Write feedback for students"
                      className="min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                    />
                  </div>

                  {proposal.status === "PENDING" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        disabled={reviewingReportId === proposal.reportId}
                        onClick={() => updateProposalStatus(proposal, "ACCEPTED")}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Approve Proposal
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={reviewingReportId === proposal.reportId}
                        onClick={() => updateProposalStatus(proposal, "DECLINED")}
                      >
                        Reject Proposal
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 inline-flex rounded-lg bg-slate-100 p-2 text-slate-600">{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
