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
  AlertCircle,
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
  PENDING: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  ACCEPTED: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  DECLINED: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const statusFilterActive: Record<string, string> = {
  ALL: "bg-blue-600 hover:bg-blue-700 text-white border-0",
  PENDING: "bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30",
  ACCEPTED: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30",
  DECLINED: "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30",
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
      // Dynamic search — no .trim() so every character typed/removed updates the list instantly
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        (proposal.reportTitle || "").toLowerCase().includes(query) ||
        (proposal.studentName || "").toLowerCase().includes(query) ||
        (proposal.groupName || "").toLowerCase().includes(query) ||
        (proposal.projectTitle || "").toLowerCase().includes(query);

      const matchesStatus = statusFilter === "ALL" || proposal.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proposals, searchQuery, statusFilter]);

  const counts = useMemo(() => {
    const pending = proposals.filter((p) => p.status === "PENDING").length;
    const accepted = proposals.filter((p) => p.status === "ACCEPTED").length;
    const declined = proposals.filter((p) => p.status === "DECLINED").length;
    return { total: proposals.length, pending, accepted, declined };
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
    <div className="min-h-screen bg-[#050A14]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-white md:text-3xl">Faculty Reports</h1>
          <p className="mt-1 text-slate-400">
            Proposal submissions from students in your assigned project groups.
          </p>
        </motion.div>

        {/* Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            label="Total Proposals"
            value={counts.total}
            color="blue"
            icon={<FileText className="h-5 w-5" />}
          />
          <StatCard
            label="Pending"
            value={counts.pending}
            color="amber"
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            label="Approved"
            value={counts.accepted}
            color="emerald"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />
          <StatCard
            label="Rejected"
            value={counts.declined}
            color="red"
            icon={<XCircle className="h-5 w-5" />}
          />
        </motion.div>

        {/* Search + Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-xl border border-blue-500/20 bg-white/5 backdrop-blur-md p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by report, student, group, or project..."
                className="pl-10 bg-white/5 border-blue-500/20 text-white placeholder:text-slate-400 focus:bg-white/10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["ALL", "PENDING", "ACCEPTED", "DECLINED"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    statusFilter === status
                      ? statusFilterActive[status]
                      : "border border-blue-500/20 text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Alerts */}
        {actionError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {actionError}
          </motion.div>
        )}
        {actionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {actionSuccess}
          </motion.div>
        )}

        {/* Proposals List */}
        {filteredProposals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-md p-12 text-center"
          >
            <FileText className="mx-auto mb-3 h-12 w-12 text-slate-600" />
            <p className="text-slate-400">No proposal reports found for your current filters.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredProposals.map((proposal) => {
              const feedbackValue =
                feedbackByReport[proposal.reportId] ?? proposal.reviewComments ?? "";
              return (
                <motion.div
                  key={proposal.reportId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-blue-500/20 bg-white/5 backdrop-blur-md p-5 hover:shadow-lg hover:border-blue-500/40 transition-all"
                >
                  {/* Title row */}
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{proposal.reportTitle}</h3>
                      <p className="text-sm text-cyan-400 mt-0.5">
                        {proposal.projectTitle || proposal.groupName}
                      </p>
                    </div>
                    <Badge className={statusStyles[proposal.status]}>{proposal.status}</Badge>
                  </div>

                  {/* Meta info */}
                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-400 md:grid-cols-2 mb-4">
                    <p className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-300">{proposal.studentName}</span>
                      <span className="text-slate-500">({proposal.studentId})</span>
                    </p>
                    <p>
                      Submitted:{" "}
                      <span className="text-slate-300">
                        {new Date(proposal.created).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </p>
                    {proposal.reviewedAt && (
                      <p>
                        Reviewed:{" "}
                        <span className="text-slate-300">
                          {new Date(proposal.reviewedAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </p>
                    )}
                    {proposal.reviewedByName && (
                      <p>
                        Reviewed By:{" "}
                        <span className="text-slate-300">{proposal.reviewedByName}</span>
                      </p>
                    )}
                  </div>

                  {/* File attachment */}
                  {proposal.file && (
                    <div className="mb-4 rounded-lg border border-blue-500/20 bg-white/5 p-3">
                      {(() => {
                        const downloadHref = `/api/download?url=${encodeURIComponent(
                          proposal.file.fileUrl
                        )}&filename=${encodeURIComponent(proposal.file.fileName)}`;
                        return (
                          <button
                            onClick={async () => {
                              const res = await fetch(downloadHref);
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = proposal.file!.fileName;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                              window.URL.revokeObjectURL(url);
                            }}
                            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            {proposal.file.fileName}
                          </button>
                        );
                      })()}
                    </div>
                  )}

                  {/* Feedback textarea */}
                  <div className="mt-2">
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Feedback{" "}
                      {proposal.status === "DECLINED"
                        ? "(Required for rejection)"
                        : "(Optional for approval)"}
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
                      className="min-h-24 w-full rounded-md border border-blue-500/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                    />
                  </div>

                  {/* Action buttons */}
                  {proposal.status === "PENDING" && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        type="button"
                        disabled={reviewingReportId === proposal.reportId}
                        onClick={() => updateProposalStatus(proposal, "ACCEPTED")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Approve Proposal
                      </Button>
                      <Button
                        type="button"
                        disabled={reviewingReportId === proposal.reportId}
                        onClick={() => updateProposalStatus(proposal, "DECLINED")}
                        className="bg-red-600/80 hover:bg-red-700 text-white border-0"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Reject Proposal
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "amber" | "emerald" | "red";
}) {
  const colorMap = {
    blue: {
      border: "border-blue-500/20",
      iconBg: "bg-blue-500/15",
      iconText: "text-cyan-400",
    },
    amber: {
      border: "border-amber-500/20",
      iconBg: "bg-amber-500/15",
      iconText: "text-amber-400",
    },
    emerald: {
      border: "border-emerald-500/20",
      iconBg: "bg-emerald-500/15",
      iconText: "text-emerald-400",
    },
    red: {
      border: "border-red-500/20",
      iconBg: "bg-red-500/15",
      iconText: "text-red-400",
    },
  };
  const c = colorMap[color];
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`rounded-2xl border ${c.border} bg-white/5 backdrop-blur-md p-4 flex items-center gap-4`}
    >
      <div className={`p-3 rounded-xl ${c.iconBg} ${c.iconText}`}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
    </motion.div>
  );
}
