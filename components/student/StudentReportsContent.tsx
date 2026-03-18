"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getStudentReports } from "@/app/actions/reportActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Plus,
  Calendar,
  User,
  MessageSquare,
} from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StudentReportsContent() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await getStudentReports();
        setReports(data as Report[]);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const statusLabelMap: Record<string, string> = {
    PENDING: "Pending Review",
    ACCEPTED: "Accepted",
    DECLINED: "Declined",
  };

  const formatStatusLabel = (status: string) =>
    statusLabelMap[status] ?? status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
      case "DECLINED":
        return "bg-red-500/20 border-red-500/40 text-red-400";
      case "PENDING":
        return "bg-amber-500/20 border-amber-500/40 text-amber-400";
      default:
        return "bg-cyan-500/20 border-cyan-500/40 text-cyan-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle2 className="h-4 w-4" />;
      case "DECLINED":
        return <XCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFileIcon = (filetype: string) => {
    if (filetype.includes("pdf")) {
      return "📄";
    } else if (filetype.includes("image")) {
      return "🖼️";
    } else if (filetype.includes("document") || filetype.includes("word")) {
      return "📑";
    }
    return "📎";
  };

  const filteredReports = reports.filter((report) => {
    if (filter === "ALL") return true;
    return report.status === filter;
  });

  const stats = [
    {
      label: "Total Reports",
      count: reports.length,
      icon: FileText,
      accent: "#00C6FF",
      glow: "rgba(0,198,255,0.15)",
    },
    {
      label: "Accepted",
      count: reports.filter((r) => r.status === "ACCEPTED").length,
      icon: CheckCircle2,
      accent: "#34d399",
      glow: "rgba(52,211,153,0.15)",
    },
    {
      label: "Pending",
      count: reports.filter((r) => r.status === "PENDING").length,
      icon: Clock,
      accent: "#fbbf24",
      glow: "rgba(251,191,36,0.15)",
    },
    {
      label: "Declined",
      count: reports.filter((r) => r.status === "DECLINED").length,
      icon: XCircle,
      accent: "#f87171",
      glow: "rgba(248,113,113,0.15)",
    },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen p-6"
        style={{
          background:
            "linear-gradient(135deg, #050A14 0%, #07111F 50%, #050A14 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-3"
              style={{ color: "rgba(180,210,255,0.7)" }}
            >
              <div
                className="h-12 w-12 rounded-full animate-spin"
                style={{
                  border: "2px solid rgba(0,198,255,0.15)",
                  borderTopColor: "#00C6FF",
                }}
              />
              <p>Loading reports...</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #050A14 0%, #07111F 50%, #050A14 100%)",
      }}
    >
      {/* Ambient glow orbs */}
      <div
        className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(0,198,255,0.06)", filter: "blur(80px)" }}
      />
      <div
        className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgba(123,95,245,0.06)", filter: "blur(80px)" }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span
                  style={{
                    background: "linear-gradient(90deg, #00C6FF, #7B5FF5)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Reports
                </span>
              </h1>
              <p style={{ color: "rgba(180,210,255,0.65)" }}>
                Track and manage your project reports
              </p>
            </div>
            <Link href="/student/reports/new">
              <Button
                className="gap-2 font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #00C6FF 0%, #7B5FF5 100%)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 0 20px rgba(0,198,255,0.3)",
                }}
              >
                <Plus className="h-4 w-4" />
                Submit New Report
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-xl p-6 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(0,198,255,0.15)",
                  backdropFilter: "blur(12px)",
                  boxShadow: `0 4px 24px ${stat.glow}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "rgba(180,210,255,0.6)" }}
                  >
                    {stat.label}
                  </p>
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: stat.glow,
                      border: `1px solid ${stat.accent}30`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: stat.accent }} />
                  </div>
                </div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: stat.accent }}
                >
                  {stat.count}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap mb-8"
        >
          {["ALL", "PENDING", "ACCEPTED", "DECLINED"].map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className="px-4 py-2 rounded-lg font-medium transition-all"
              style={
                filter === status
                  ? {
                      background:
                        "linear-gradient(135deg, #00C6FF 0%, #7B5FF5 100%)",
                      color: "#fff",
                      border: "1px solid transparent",
                      boxShadow: "0 0 20px rgba(0,198,255,0.3)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(180,210,255,0.7)",
                      border: "1px solid rgba(0,198,255,0.15)",
                      backdropFilter: "blur(8px)",
                    }
              }
            >
              {status === "ALL"
                ? "All Reports"
                : `${formatStatusLabel(status)} (${reports.filter((r) => r.status === status).length})`}
            </motion.button>
          ))}
        </motion.div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-12 text-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(0,198,255,0.15)",
              backdropFilter: "blur(12px)",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div
                className="p-6 rounded-full"
                style={{
                  background: "rgba(0,198,255,0.1)",
                  border: "1px solid rgba(0,198,255,0.2)",
                }}
              >
                <FileText
                  className="h-12 w-12 mx-auto"
                  style={{ color: "#00C6FF" }}
                />
              </div>
            </motion.div>
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "#E8F4FF" }}
            >
              No reports submitted yet
            </h3>
            <p
              className="max-w-md mx-auto mb-6"
              style={{ color: "rgba(180,210,255,0.6)" }}
            >
              Start by submitting your first project report. Your faculty guide
              will review it and provide feedback.
            </p>
            <Link href="/student/reports/new">
              <Button
                className="font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, #00C6FF 0%, #7B5FF5 100%)",
                  color: "#fff",
                  border: "none",
                  boxShadow: "0 0 20px rgba(0,198,255,0.3)",
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Submit Your First Report
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredReports.map((report) => (
              <motion.div
                key={report.reportid}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group h-full"
              >
                <div
                  className="rounded-xl overflow-hidden transition-all h-full flex flex-col"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(0,198,255,0.15)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 4px 24px rgba(0,198,255,0.05)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 8px 40px rgba(0,198,255,0.15)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow =
                      "0 4px 24px rgba(0,198,255,0.05)")
                  }
                >
                  {/* Card Header */}
                  <div
                    className="p-6"
                    style={{ borderBottom: "1px solid rgba(0,198,255,0.08)" }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold line-clamp-2 mb-1"
                          style={{ color: "#E8F4FF" }}
                        >
                          {report.reporttitle}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: "rgba(180,210,255,0.6)" }}
                        >
                          {report.projectgroup.projectgroupname}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={`border ${getStatusColor(report.status)}`}
                      >
                        <span className="flex items-center gap-1.5">
                          {getStatusIcon(report.status)}
                          {formatStatusLabel(report.status)}
                        </span>
                      </Badge>
                      <Badge
                        variant="outline"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(180,210,255,0.15)",
                          color: "rgba(180,210,255,0.7)",
                        }}
                      >
                        {report.reporttype}
                      </Badge>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    {/* File Section */}
                    {report.projectfile ? (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-2"
                          style={{ color: "rgba(180,210,255,0.45)" }}
                        >
                          Attached File
                        </p>
                        <a
                          href={`/api/download?url=${encodeURIComponent(report.projectfile.fileurl)}&filename=${encodeURIComponent(report.projectfile.filename)}`}
                          className="flex items-center gap-3 p-3 rounded-lg transition-colors group/file"
                          style={{
                            background: "rgba(0,198,255,0.06)",
                            border: "1px solid rgba(0,198,255,0.2)",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(0,198,255,0.12)")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                              "rgba(0,198,255,0.06)")
                          }
                        >
                          <span className="text-xl">
                            {getFileIcon(report.projectfile.filetype)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "#E8F4FF" }}
                            >
                              {report.projectfile.filename}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "rgba(180,210,255,0.5)" }}
                            >
                              {report.projectfile.filesize
                                ? `${(report.projectfile.filesize / 1024).toFixed(2)} KB`
                                : "No size info"}
                            </p>
                          </div>
                          <Download
                            className="h-4 w-4"
                            style={{ color: "rgba(180,210,255,0.5)" }}
                          />
                        </a>
                        {report.projectfile.filetype.includes("image") && (
                          <img
                            src={report.projectfile.fileurl}
                            alt={report.projectfile.filename}
                            className="mt-3 h-32 w-full object-cover rounded-lg"
                            style={{ border: "1px solid rgba(0,198,255,0.15)" }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        className="p-3 rounded-lg"
                        style={{
                          background: "rgba(251,191,36,0.06)",
                          border: "1px solid rgba(251,191,36,0.2)",
                        }}
                      >
                        <p
                          className="text-xs font-medium"
                          style={{ color: "#fbbf24" }}
                        >
                          ⚠️ No file attached to this report
                        </p>
                      </div>
                    )}

                    {/* Reviewer Comments */}
                    {report.reviewcomments && (
                      <div>
                        <p
                          className="text-xs font-semibold uppercase tracking-wide mb-2"
                          style={{ color: "rgba(180,210,255,0.45)" }}
                        >
                          Feedback
                        </p>
                        <div
                          className="p-3 rounded"
                          style={{
                            background: "rgba(0,198,255,0.05)",
                            borderLeft: "4px solid #00C6FF",
                          }}
                        >
                          <p
                            className="text-sm"
                            style={{ color: "rgba(180,210,255,0.85)" }}
                          >
                            {report.reviewcomments}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div
                      className="pt-4 mt-auto space-y-2"
                      style={{ borderTop: "1px solid rgba(0,198,255,0.08)" }}
                    >
                      {report.staff && (
                        <div className="flex items-center gap-2 text-sm">
                          <User
                            className="h-4 w-4"
                            style={{ color: "rgba(180,210,255,0.4)" }}
                          />
                          <span style={{ color: "rgba(180,210,255,0.55)" }}>
                            Reviewed by
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "#E8F4FF" }}
                          >
                            {report.staff.staffname}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar
                          className="h-4 w-4"
                          style={{ color: "rgba(180,210,255,0.4)" }}
                        />
                        <span style={{ color: "rgba(180,210,255,0.55)" }}>
                          Submitted
                        </span>
                        <span
                          className="font-medium"
                          style={{ color: "#E8F4FF" }}
                        >
                          {new Date(report.created).toLocaleDateString()}
                        </span>
                      </div>
                      {report.modified && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare
                            className="h-4 w-4"
                            style={{ color: "rgba(180,210,255,0.4)" }}
                          />
                          <span style={{ color: "rgba(180,210,255,0.55)" }}>
                            Updated
                          </span>
                          <span
                            className="font-medium"
                            style={{ color: "#E8F4FF" }}
                          >
                            {new Date(report.modified).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div
                    className="p-6 space-y-2"
                    style={{
                      borderTop: "1px solid rgba(0,198,255,0.08)",
                      background: "rgba(0,198,255,0.02)",
                    }}
                  >
                    <Link
                      href={`/student/reports/${report.reportid}`}
                      className="block"
                    >
                      <Button
                        variant="outline"
                        className="w-full font-medium transition-all"
                        style={{
                          background: "rgba(0,198,255,0.07)",
                          border: "1px solid rgba(0,198,255,0.25)",
                          color: "#00C6FF",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(0,198,255,0.15)";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "rgba(0,198,255,0.5)";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(0,198,255,0.07)";
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.borderColor = "rgba(0,198,255,0.25)";
                        }}
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
