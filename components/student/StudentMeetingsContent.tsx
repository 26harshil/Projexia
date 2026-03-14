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
        return <Badge className="bg-red-100 text-red-700 border-0">Today</Badge>;
      } else if (meetingDateOnly.getTime() === tomorrow.getTime()) {
        return <Badge className="bg-orange-100 text-orange-700 border-0">Tomorrow</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-700 border-0">Scheduled</Badge>;
    }

    if (meeting.status === "Completed") {
      return <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-700 border-0">Pending Review</Badge>;
  };

  const getAttendanceBadge = (meeting: Meeting) => {
    if (meeting.attendance.isPresent === null) {
      return <Badge className="bg-slate-100 text-slate-700 border-0">Not Marked</Badge>;
    }
    return meeting.attendance.isPresent
      ? <Badge className="bg-green-100 text-green-700 border-0">Present</Badge>
      : <Badge className="bg-red-100 text-red-700 border-0">Absent</Badge>;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              My{" "}
              <span className="bg-linear-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Meetings
              </span>
            </h1>
            <p className="text-slate-600">Schedule and track your meetings with guides</p>
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
              color: "blue",
            },
            {
              label: "Completed",
              count: completedMeetings,
              icon: CheckCircle2,
              color: "green",
            },
            {
              label: "Attendance",
              count: `${attendancePercentage}%`,
              icon: Users,
              color: "purple",
            },
            {
              label: "Total",
              count: totalMeetings,
              icon: FileText,
              color: "slate",
            },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-all ${
                stat.color === "blue"
                  ? "border-blue-100 bg-blue-50/30"
                  : stat.color === "green"
                  ? "border-green-100 bg-green-50/30"
                  : stat.color === "purple"
                  ? "border-purple-100 bg-purple-50/30"
                  : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "purple"
                      ? "bg-purple-100"
                      : "bg-slate-100"
                  }`}
                >
                  <stat.icon
                    className={`h-5 w-5 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "purple"
                        ? "text-purple-600"
                        : "text-slate-600"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-2xl font-bold ${
                      stat.color === "blue"
                        ? "text-blue-900"
                        : stat.color === "green"
                        ? "text-green-900"
                        : stat.color === "purple"
                        ? "text-purple-900"
                        : "text-slate-900"
                    }`}
                  >
                    {stat.count}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
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
            <TabsList className="bg-white border border-slate-200 p-1 mb-6 shadow-sm">
              <TabsTrigger
                value="upcoming"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming ({meetings.upcoming.length})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-700"
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
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <div className="bg-blue-100 p-6 rounded-full">
                      <Calendar className="h-12 w-12 text-blue-400 mx-auto" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Upcoming Meetings
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    You don't have any scheduled meetings. Your guide will schedule
                    meetings as needed to discuss your project progress.
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
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-4"
                  >
                    <div className="bg-slate-100 p-6 rounded-full">
                      <CheckCircle2 className="h-12 w-12 text-slate-400 mx-auto" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No Past Meetings
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    You haven't had any meetings yet. Start scheduling meetings with your
                    guide to get started.
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div
        className={`bg-white rounded-xl border transition-all cursor-pointer shadow-sm hover:shadow-md ${
          type === "upcoming" && format(meetingDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
            ? "border-red-200 bg-red-50/40"
            : "border-slate-200"
        }`}
        onClick={onToggleExpand}
      >
        {/* Summary */}
        <div className="p-5">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Date & Time */}
            <div className="flex items-center gap-4 shrink-0">
              <div
                className={`p-3 rounded-lg ${
                  type === "upcoming" ? "bg-blue-100" : "bg-slate-100"
                }`}
              >
                <Calendar
                  className={`h-5 w-5 ${
                    type === "upcoming" ? "text-blue-600" : "text-slate-600"
                  }`}
                />
              </div>
              <div>
                <p className="font-bold text-slate-900">
                  {format(meetingDate, "d MMM")}
                </p>
                <p className="text-sm text-slate-500">
                  {format(meetingDate, "HH:mm")}
                </p>
              </div>
            </div>

            {/* Meeting Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-slate-900 truncate">
                  {meeting.purpose}
                </h3>
                {getStatusBadge(meeting, type)}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                {meeting.guide && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {meeting.guide}
                  </span>
                )}
                {meeting.projectTitle && (
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {meeting.projectTitle}
                  </span>
                )}
                {meeting.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {meeting.location}
                  </span>
                )}
              </div>
            </div>

            {/* Attendance & Expand */}
            <div className="flex items-center gap-2 shrink-0">
              {type === "past" && getAttendanceBadge(meeting)}
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-5 w-5 text-slate-400" />
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
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-100"
            >
              <div className="p-5 space-y-4 bg-linear-to-b from-white via-slate-50/50 to-white">
                {/* Attendance Information */}
                {type === "past" && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-xs text-slate-600 font-medium">Attendance Status</p>
                      <div className="mt-1">
                        {meeting.attendance.isPresent === null ? (
                          <p className="text-sm text-slate-700 font-semibold">Not Marked</p>
                        ) : meeting.attendance.isPresent ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-700 font-semibold">Present</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <p className="text-sm text-red-700 font-semibold">Absent</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {meeting.attendance.remarks && (
                      <div>
                        <p className="text-xs text-slate-600 font-medium">Remarks</p>
                        <p className="text-sm text-slate-700 mt-1 line-clamp-2">
                          {meeting.attendance.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Meeting Notes */}
                {meeting.notes && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-600" />
                      Meeting Notes
                    </h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                      {meeting.notes}
                    </p>
                  </div>
                )}

                {/* Grade (for completed meetings) */}
                {type === "past" && meeting.grade && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-xs text-slate-600 font-medium">Meeting Grade</p>
                      <p className="text-xl font-bold text-purple-700 mt-1">
                        {meeting.grade}
                      </p>
                    </div>
                    {meeting.status === "Completed" && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-slate-600 font-medium">Status</p>
                        <p className="text-sm font-semibold text-green-700 mt-1">
                          Completed & Reviewed
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Description */}
                {meeting.description && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Additional Info</h4>
                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                      {meeting.description}
                    </p>
                  </div>
                )}

                {/* Meeting Details Summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Group</p>
                    <p className="text-sm text-slate-900 font-semibold mt-1">
                      {meeting.groupName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Guide</p>
                    <p className="text-sm text-slate-900 font-semibold mt-1">
                      {meeting.guide || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Time</p>
                    <p className="text-sm text-slate-900 font-semibold mt-1">
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
