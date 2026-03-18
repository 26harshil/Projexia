"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  FileText,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { format } from "date-fns";

interface Attendance {
  isPresent: boolean | null;
  remarks: string | null;
}

interface Meeting {
  id: number;
  datetime: Date | string;
  purpose: string;
  location: string | null;
  status: string | null;
  notes: string | null;
  grade: string | null;
  description: string | null;
  groupId: number;
  groupName: string;
  projectTitle: string | null;
  guide: string | null;
  guideEmail: string | null;
  attendance: Attendance;
}

interface StudentMeetingsContentProps {
  meetings: {
    upcoming: Meeting[];
    past: Meeting[];
  };
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

export function StudentMeetingsContent({ meetings }: StudentMeetingsContentProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [expandedMeetingId, setExpandedMeeting] = useState<number | null>(null);

  const allMeetings = [...meetings.upcoming, ...meetings.past];
  const totalMeetings = allMeetings.length;
  const attendedMeetings = allMeetings.filter(m => m.attendance.isPresent === true).length;
  const attendancePercentage = totalMeetings > 0
    ? Math.round((attendedMeetings / totalMeetings) * 100)
    : 0;
  const completedMeetings = meetings.past.filter(m => m.status === "Completed").length;

  const getStatusBadge = (meeting: Meeting, type: "upcoming" | "past") => {
    if (type === "upcoming") {
      const meetingDate = new Date(meeting.datetime);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const meetingDateOnly = new Date(meetingDate);
      meetingDateOnly.setHours(0, 0, 0, 0);

      if (meetingDateOnly.getTime() === today.getTime()) {
        return <Badge className="bg-red-500/20 border border-red-500/40 text-red-400">🔴 Today</Badge>;
      } else if (meetingDateOnly.getTime() === tomorrow.getTime()) {
        return <Badge className="bg-orange-500/20 border border-orange-500/40 text-orange-400">⏰ Tomorrow</Badge>;
      }
      return <Badge className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">📅 Scheduled</Badge>;
    }

    if (meeting.status === "Completed") {
      return <Badge className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">✓ Completed</Badge>;
    }
    return <Badge className="bg-amber-500/20 border border-amber-500/40 text-amber-400">⏳ Pending</Badge>;
  };

  const getAttendanceBadge = (meeting: Meeting) => {
    if (meeting.attendance.isPresent === null) {
      return <Badge className="bg-slate-500/20 border border-slate-500/40 text-slate-400">— Not Marked</Badge>;
    }
    return meeting.attendance.isPresent
      ? <Badge className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">✓ Present</Badge>
      : <Badge className="bg-red-500/20 border border-red-500/40 text-red-400">✗ Absent</Badge>;
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #050A14 0%, #07111F 50%, #050A14 100%)" }}>
      {/* Ambient glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(0,198,255,0.06)", filter: "blur(80px)" }} />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "rgba(123,95,245,0.06)", filter: "blur(80px)" }} />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#E8F4FF" }}>
              My{" "}
              <span style={{ background: "linear-gradient(90deg, #00C6FF, #7B5FF5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Meetings
              </span>
            </h1>
            <p style={{ color: "rgba(180,210,255,0.65)" }}>Track and manage all your meetings with faculty guides</p>
          </div>
        </motion.div>

        {/* Meeting Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            {
              label: "Upcoming",
              count: meetings.upcoming.length,
              icon: Calendar,
              accent: "#00C6FF",
              glow: "rgba(0,198,255,0.15)",
            },
            {
              label: "Completed",
              count: completedMeetings,
              icon: CheckCircle2,
              accent: "#34d399",
              glow: "rgba(52,211,153,0.15)",
            },
            {
              label: "Attendance",
              count: `${attendancePercentage}%`,
              icon: Users,
              accent: "#7B5FF5",
              glow: "rgba(123,95,245,0.15)",
            },
            {
              label: "Total",
              count: totalMeetings,
              icon: FileText,
              accent: "rgba(180,210,255,0.7)",
              glow: "rgba(180,210,255,0.08)",
            },
          ].map((stat, idx) => (
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.5)" }}>{stat.label}</p>
                  <p className="text-3xl font-bold mt-2" style={{ color: stat.accent }}>
                    {stat.count}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: stat.glow, border: `1px solid ${stat.accent}30` }}>
                  <stat.icon className="h-6 w-6" style={{ color: stat.accent }} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList
              className="p-1.5 mb-6 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,198,255,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                style={{ color: "rgba(180,210,255,0.6)" }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming ({meetings.upcoming.length})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                style={{ color: "rgba(180,210,255,0.6)" }}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Past ({meetings.past.length})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Meetings */}
            <TabsContent value="upcoming" className="space-y-4">
              {meetings.upcoming.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {meetings.upcoming.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      type="upcoming"
                      isExpanded={expandedMeetingId === meeting.id}
                      onToggleExpand={() =>
                        setExpandedMeeting(
                          expandedMeetingId === meeting.id ? null : meeting.id
                        )
                      }
                      getStatusBadge={getStatusBadge}
                      getAttendanceBadge={getAttendanceBadge}
                    />
                  ))}
                </motion.div>
              ) : (
                <div
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
                    <div className="p-6 rounded-full" style={{ background: "rgba(0,198,255,0.1)", border: "1px solid rgba(0,198,255,0.2)" }}>
                      <Calendar className="h-12 w-12 mx-auto" style={{ color: "#00C6FF" }} />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#E8F4FF" }}>
                    No Upcoming Meetings
                  </h3>
                  <p className="max-w-md mx-auto" style={{ color: "rgba(180,210,255,0.6)" }}>
                    You don't have any scheduled meetings yet. Your faculty guide will schedule meetings when they're ready to discuss your project progress.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Past Meetings */}
            <TabsContent value="past" className="space-y-4">
              {meetings.past.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {meetings.past.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      meeting={meeting}
                      type="past"
                      isExpanded={expandedMeetingId === meeting.id}
                      onToggleExpand={() =>
                        setExpandedMeeting(
                          expandedMeetingId === meeting.id ? null : meeting.id
                        )
                      }
                      getStatusBadge={getStatusBadge}
                      getAttendanceBadge={getAttendanceBadge}
                    />
                  ))}
                </motion.div>
              ) : (
                <div
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
                    <div className="p-6 rounded-full" style={{ background: "rgba(180,210,255,0.06)", border: "1px solid rgba(180,210,255,0.15)" }}>
                      <CheckCircle2 className="h-12 w-12 mx-auto" style={{ color: "rgba(180,210,255,0.5)" }} />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "#E8F4FF" }}>
                    No Past Meetings
                  </h3>
                  <p className="max-w-md mx-auto" style={{ color: "rgba(180,210,255,0.6)" }}>
                    You haven't had any meetings yet. Start scheduling meetings with your guide to get started.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

// ===================== MEETING CARD =====================

function MeetingCard({
  meeting,
  type,
  isExpanded,
  onToggleExpand,
  getStatusBadge,
  getAttendanceBadge,
}: {
  meeting: Meeting;
  type: "upcoming" | "past";
  isExpanded: boolean;
  onToggleExpand: () => void;
  getStatusBadge: (meeting: Meeting, type: "upcoming" | "past") => React.ReactNode;
  getAttendanceBadge: (meeting: Meeting) => React.ReactNode;
}) {
  const meetingDate = new Date(meeting.datetime);
  const isToday = type === "upcoming" && format(meetingDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div
        className="rounded-xl transition-all cursor-pointer"
        style={{
          background: isToday ? "rgba(239,68,68,0.06)" : "rgba(255,255,255,0.04)",
          border: isToday ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,198,255,0.15)",
          backdropFilter: "blur(12px)",
          boxShadow: isToday ? "0 4px 24px rgba(239,68,68,0.1)" : "0 4px 24px rgba(0,198,255,0.05)",
        }}
        onClick={onToggleExpand}
      >
        {/* Summary */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Date & Time */}
            <div className="flex items-center gap-4 shrink-0">
              <div
                className="p-3 rounded-lg"
                style={{
                  background: type === "upcoming" ? "rgba(0,198,255,0.1)" : "rgba(180,210,255,0.06)",
                  border: type === "upcoming" ? "1px solid rgba(0,198,255,0.2)" : "1px solid rgba(180,210,255,0.12)",
                }}
              >
                <Calendar
                  className="h-5 w-5"
                  style={{ color: type === "upcoming" ? "#00C6FF" : "rgba(180,210,255,0.6)" }}
                />
              </div>
              <div>
                <p className="font-bold" style={{ color: "#E8F4FF" }}>
                  {format(meetingDate, "d MMM yyyy")}
                </p>
                <p className="text-sm flex items-center gap-1" style={{ color: "rgba(180,210,255,0.5)" }}>
                  <Clock className="h-3 w-3" />
                  {format(meetingDate, "HH:mm")}
                </p>
              </div>
            </div>

            {/* Meeting Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="font-bold truncate text-base" style={{ color: "#E8F4FF" }}>
                  {meeting.purpose}
                </h3>
                {getStatusBadge(meeting, type)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "rgba(180,210,255,0.6)" }}>
                {meeting.guide && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,210,255,0.1)" }}>
                    <User className="h-3.5 w-3.5" />
                    {meeting.guide}
                  </span>
                )}
                {meeting.projectTitle && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,210,255,0.1)" }}>
                    <Zap className="h-3.5 w-3.5" />
                    {meeting.projectTitle}
                  </span>
                )}
                {meeting.location && (
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(180,210,255,0.1)" }}>
                    <MapPin className="h-3.5 w-3.5" />
                    {meeting.location}
                  </span>
                )}
              </div>
            </div>

            {/* Attendance & Expand */}
            <div className="flex items-center gap-3 shrink-0">
              {type === "past" && getAttendanceBadge(meeting)}
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="h-5 w-5" style={{ color: "rgba(180,210,255,0.4)" }} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Details - Expandable */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              style={{ borderTop: "1px solid rgba(0,198,255,0.1)" }}
            >
              <div className="p-6 space-y-5" style={{ background: "rgba(0,198,255,0.02)" }}>
                {/* Attendance Information */}
                {type === "past" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ background: "rgba(0,198,255,0.06)", border: "1px solid rgba(0,198,255,0.2)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.5)" }}>Attendance</p>
                      <div className="mt-3">
                        {meeting.attendance.isPresent === null ? (
                          <p className="text-sm font-semibold" style={{ color: "rgba(180,210,255,0.7)" }}>Not Marked Yet</p>
                        ) : meeting.attendance.isPresent ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5" style={{ color: "#34d399" }} />
                            <p className="text-sm font-semibold" style={{ color: "#34d399" }}>Present</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <p className="text-sm font-semibold text-red-400">Absent</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {meeting.attendance.remarks && (
                      <div className="p-4 rounded-lg" style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)" }}>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.5)" }}>Remarks</p>
                        <p className="text-sm mt-3 line-clamp-3" style={{ color: "rgba(180,210,255,0.8)" }}>
                          {meeting.attendance.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Meeting Notes */}
                {meeting.notes && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm" style={{ color: "#E8F4FF" }}>
                      <FileText className="h-4 w-4" style={{ color: "#00C6FF" }} />
                      Meeting Notes
                    </h4>
                    <p className="text-sm p-4 rounded-lg" style={{ color: "rgba(180,210,255,0.8)", background: "rgba(0,198,255,0.06)", border: "1px solid rgba(0,198,255,0.15)" }}>
                      {meeting.notes}
                    </p>
                  </div>
                )}

                {/* Grade (for completed meetings) */}
                {type === "past" && meeting.grade && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg" style={{ background: "rgba(123,95,245,0.1)", border: "1px solid rgba(123,95,245,0.25)" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.5)" }}>Meeting Grade</p>
                      <p className="text-2xl font-bold mt-2" style={{ color: "#7B5FF5" }}>
                        {meeting.grade}
                      </p>
                    </div>
                    {meeting.status === "Completed" && (
                      <div className="p-4 rounded-lg" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.5)" }}>Status</p>
                        <p className="text-sm font-semibold mt-2" style={{ color: "#34d399" }}>
                          ✓ Completed
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Description */}
                {meeting.description && (
                  <div>
                    <h4 className="font-semibold mb-3 text-sm" style={{ color: "#E8F4FF" }}>Additional Information</h4>
                    <p className="text-sm p-4 rounded-lg" style={{ color: "rgba(180,210,255,0.8)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(180,210,255,0.1)" }}>
                      {meeting.description}
                    </p>
                  </div>
                )}

                {/* Meeting Details Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4" style={{ borderTop: "1px solid rgba(0,198,255,0.1)" }}>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.45)" }}>Group</p>
                    <p className="text-sm font-semibold mt-2" style={{ color: "#E8F4FF" }}>
                      {meeting.groupName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.45)" }}>Guide</p>
                    <p className="text-sm font-semibold mt-2" style={{ color: "#E8F4FF" }}>
                      {meeting.guide || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "rgba(180,210,255,0.45)" }}>Time</p>
                    <p className="text-sm font-semibold mt-2" style={{ color: "#E8F4FF" }}>
                      {format(meetingDate, "HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
