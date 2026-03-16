// /components/faculty/FacultyDashboardContent.tsx
"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Crown,
  FolderKanban,
  Activity,
  Layers,
  FileText,
  UserCheck,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface RecentGroup {
  id: number;
  name: string;
  title: string | null;
  projectType: string | null;
  memberCount: number;
  leaderName: string | null;
}

interface UpcomingMeeting {
  id: number;
  datetime: Date;
  purpose: string | null;
  location: string | null;
  groupName: string | undefined;
  projectTitle: string | null | undefined;
}

interface GroupOverview {
  id: number;
  name: string;
  title: string | null;
  area: string | null;
  description: string | null;
  projectType: string | null;
  memberCount: number;
  leaderName: string | null;
  lastMeetingDate: Date | null;
  lastMeetingStatus: string | null;
  lastMeetingPurpose: string | null;
  created: Date;
}

interface RecentActivityItem {
  id: number;
  type: "meeting";
  datetime: Date;
  purpose: string | null;
  status: string | null;
  groupName: string | undefined;
  projectTitle: string | null | undefined;
  totalAttendees: number;
  presentCount: number;
}

interface ProjectTypeBreakdown {
  id: number;
  name: string;
  groupCount: number;
}

interface DashboardStats {
  staffName: string;
  staffEmail: string | null;
  studentGroups: number;
  totalStudents: number;
  upcomingMeetings: number;
  todayMeetings: number;
  thisWeekMeetings: number;
  pendingReviews: number;
  completedMeetings: number;
  totalMeetings: number;
  meetingCompletionRate: number;
  attendanceRate: number;
  projectTypesCount: number;
  recentGroups: RecentGroup[];
  upcomingMeetingsList: UpcomingMeeting[];
  groupsOverview: GroupOverview[];
  recentActivity: RecentActivityItem[];
  projectTypeBreakdown: ProjectTypeBreakdown[];
}

interface FacultyDashboardContentProps {
  firstName: string;
  stats: DashboardStats | null;
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

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function FacultyDashboardContent({
  firstName,
  stats,
}: FacultyDashboardContentProps) {
  const recentGroups = stats?.recentGroups || [];
  const upcomingMeetings = stats?.upcomingMeetingsList || [];
  const groupsOverview = stats?.groupsOverview || [];
  const recentActivity = stats?.recentActivity || [];
  const projectTypeBreakdown = stats?.projectTypeBreakdown || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Top Row: Student Groups + Meeting Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Groups Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/15 rounded-xl">
                  <Users className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Student Groups
                  </h3>
                  <p className="text-sm text-slate-500">
                    {stats?.studentGroups || 0} groups &middot;{" "}
                    {stats?.totalStudents || 0} students
                  </p>
                </div>
              </div>
              <Link href="/faculty/group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-cyan-400 hover:text-cyan-400 hover:bg-blue-500/10"
                >
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-6">
              {recentGroups.length > 0 ? (
                <div className="space-y-3">
                  {recentGroups.map((group, index) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="p-2 bg-amber-500/15 rounded-lg">
                        <FolderKanban className="h-4 w-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm truncate">
                          {group.title || group.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {group.memberCount} members
                          </span>
                          {group.projectType && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-blue-500/10 text-cyan-400"
                            >
                              {group.projectType}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {group.leaderName && (
                        <div className="flex items-center gap-1 text-xs text-amber-400">
                          <Crown className="h-3 w-3" />
                          <span className="truncate max-w-[80px]">
                            {group.leaderName}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {(stats?.studentGroups || 0) > 3 && (
                    <p className="text-xs text-center text-slate-400 pt-1">
                      + {(stats?.studentGroups || 0) - 3} more groups
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-amber-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl">
                      <Users className="h-12 w-12 text-amber-400" />
                    </div>
                  </motion.div>
                  <p className="text-slate-300 font-medium mb-1">
                    No groups assigned yet
                  </p>
                  <p className="text-sm text-slate-400 text-center max-w-xs">
                    Student groups will appear here once assigned
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Meeting Schedule Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/15 rounded-xl">
                  <Calendar className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Meeting Schedule
                  </h3>
                  <p className="text-sm text-slate-500">
                    Upcoming meetings with students
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-500/10 text-cyan-400 border-blue-500/20"
              >
                {stats?.todayMeetings || 0} Today
              </Badge>
            </div>

            <div className="p-6">
              {upcomingMeetings.length > 0 ? (
                <div className="space-y-3">
                  {upcomingMeetings.map((meeting, index) => {
                    const meetingDate = new Date(meeting.datetime);
                    const isToday =
                      meetingDate.toDateString() === new Date().toDateString();
                    const isTomorrow =
                      meetingDate.toDateString() ===
                      new Date(
                        Date.now() + 24 * 60 * 60 * 1000
                      ).toDateString();

                    return (
                      <motion.div
                        key={meeting.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl transition-colors",
                          isToday
                            ? "bg-blue-500/10 border border-blue-500/20"
                            : "bg-white/5 hover:bg-white/5"
                        )}
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg text-center min-w-[50px]",
                            isToday ? "bg-blue-500/15" : "bg-slate-200"
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs font-medium",
                              isToday ? "text-cyan-400" : "text-slate-300"
                            )}
                          >
                            {isToday
                              ? "Today"
                              : isTomorrow
                                ? "Tomorrow"
                                : meetingDate.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                  })}
                          </p>
                          <p className="text-sm font-bold text-white">
                            {meetingDate.toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">
                            {meeting.purpose || "Project Meeting"}
                          </p>
                          <p className="text-xs text-cyan-400 truncate">
                            {meeting.groupName || meeting.projectTitle}
                          </p>
                          {meeting.location && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3" />
                              {meeting.location}
                            </p>
                          )}
                        </div>
                        {isToday && (
                          <Badge className="bg-blue-600 text-white text-xs">
                            Now
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                  <Link href="/faculty/meetings" className="block">
                    <Button
                      variant="outline"
                      className="w-full mt-2 border-cyan-500/25 text-cyan-400 hover:bg-blue-500/10"
                    >
                      View All Meetings
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                      <Calendar className="h-12 w-12 text-cyan-400" />
                    </div>
                  </motion.div>
                  <p className="text-slate-300 font-medium mb-1">
                    No meetings scheduled
                  </p>
                  <p className="text-sm text-slate-400 text-center max-w-xs mb-4">
                    Schedule meetings with your student groups
                  </p>
                  <Link href="/faculty/meetings">
                    <Button className="bg-blue-600 hover:bg-emerald-700 text-white">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Middle Row: Project Overview (full width) */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <Layers className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Project Overview
                </h3>
                <p className="text-sm text-slate-500">
                  All groups under your supervision
                </p>
              </div>
            </div>
            <Link href="/faculty/group">
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              >
                Manage Groups
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6">
            {groupsOverview.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 pr-4">Group / Project</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4">Members</th>
                      <th className="pb-3 pr-4">Leader</th>
                      <th className="pb-3 pr-4">Last Meeting</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {groupsOverview.map((group, index) => (
                      <motion.tr
                        key={group.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium text-white text-sm">
                              {group.title || group.name}
                            </p>
                            {group.area && (
                              <p className="text-xs text-slate-500">
                                {group.area}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          {group.projectType ? (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-violet-50 text-violet-600"
                            >
                              {group.projectType}
                            </Badge>
                          ) : (
                            <span className="text-xs text-slate-400">&mdash;</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1 text-sm text-slate-200">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            {group.memberCount}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          {group.leaderName ? (
                            <div className="flex items-center gap-1 text-sm text-amber-400">
                              <Crown className="h-3.5 w-3.5" />
                              <span className="truncate max-w-[100px]">
                                {group.leaderName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {group.lastMeetingDate ? (
                            <div className="text-xs text-slate-300">
                              <p>
                                {new Date(
                                  group.lastMeetingDate
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                              {group.lastMeetingPurpose && (
                                <p className="text-slate-400 truncate max-w-[120px]">
                                  {group.lastMeetingPurpose}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No meetings yet
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          {group.lastMeetingStatus === "Completed" ? (
                            <Badge className="bg-blue-500/10 text-cyan-400 border-blue-500/20 text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              On Track
                            </Badge>
                          ) : group.lastMeetingStatus ? (
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {group.lastMeetingStatus}
                            </Badge>
                          ) : (
                            <Badge className="bg-white/5 text-slate-500 border-blue-500/15 text-xs">
                              New
                            </Badge>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-violet-200 rounded-2xl blur-xl opacity-40" />
                  <div className="relative bg-violet-50 border border-violet-100 p-6 rounded-2xl">
                    <Layers className="h-12 w-12 text-violet-400" />
                  </div>
                </div>
                <p className="text-slate-300 font-medium mb-1">
                  No projects yet
                </p>
                <p className="text-sm text-slate-400 text-center max-w-xs">
                  Projects will appear once groups are assigned to you
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Recent Activity + Quick Stats + Project Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/15 rounded-xl">
                  <Activity className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-slate-500">
                    Past meetings & events
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => {
                    const attendancePercent =
                      activity.totalAttendees > 0
                        ? Math.round(
                            (activity.presentCount /
                              activity.totalAttendees) *
                              100
                          )
                        : 0;
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-white/5 rounded-xl"
                      >
                        <div
                          className={cn(
                            "p-1.5 rounded-lg mt-0.5",
                            activity.status === "Completed"
                              ? "bg-blue-500/15"
                              : "bg-amber-500/15"
                          )}
                        >
                          {activity.status === "Completed" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                          ) : (
                            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white text-sm truncate">
                            {activity.purpose || "Meeting"}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {activity.groupName} &middot;{" "}
                            {formatTimeAgo(activity.datetime)}
                          </p>
                          {activity.totalAttendees > 0 && (
                            <div className="flex items-center gap-2 mt-1">
                              <UserCheck className="h-3 w-3 text-slate-400" />
                              <span className="text-xs text-slate-500">
                                {activity.presentCount}/
                                {activity.totalAttendees} present (
                                {attendancePercent}%)
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <Activity className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-sm text-slate-500">No recent activity</p>
                  <p className="text-xs text-slate-400 text-center mt-1">
                    Activity will appear after meetings
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-slate-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Quick Stats</h3>
                  <p className="text-sm text-slate-500">
                    Your activity overview
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {[
                  {
                    label: "Total Students",
                    value: stats?.totalStudents?.toString() || "0",
                    icon: Users,
                    color: "emerald" as const,
                  },
                  {
                    label: "Active Groups",
                    value: stats?.studentGroups?.toString() || "0",
                    icon: FolderKanban,
                    color: "amber" as const,
                  },
                  {
                    label: "Total Meetings",
                    value: stats?.totalMeetings?.toString() || "0",
                    icon: CalendarDays,
                    color: "blue" as const,
                  },
                  {
                    label: "Completed",
                    value: stats?.completedMeetings?.toString() || "0",
                    icon: CheckCircle2,
                    color: "emerald" as const,
                  },
                  {
                    label: "Pending Reviews",
                    value: stats?.pendingReviews?.toString() || "0",
                    icon: AlertCircle,
                    color: "amber" as const,
                    href: "/faculty/reviews",
                  },
                ].map((stat, index) => {
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.08 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            stat.color === "emerald" && "bg-blue-500/15",
                            stat.color === "amber" && "bg-amber-500/15",
                            stat.color === "blue" && "bg-blue-500/15"
                          )}
                        >
                          <stat.icon
                            className={cn(
                              "h-4 w-4",
                              stat.color === "emerald" && "text-cyan-400",
                              stat.color === "amber" && "text-amber-400",
                              stat.color === "blue" && "text-blue-400"
                            )}
                          />
                        </div>
                        <span className="text-sm text-slate-300">
                          {stat.label}
                        </span>
                      </div>
                      <span className="font-bold text-white">
                        {stat.value}
                      </span>
                    </motion.div>
                  );

                  return stat.href ? (
                    <Link key={stat.label} href={stat.href}>
                      {content}
                    </Link>
                  ) : (
                    <div key={stat.label}>{content}</div>
                  );
                })}
              </div>

              {/* Attendance Rate */}
              <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-amber-50 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-200">
                    Attendance Rate
                  </span>
                  <span className="text-sm font-bold text-cyan-400">
                    {stats?.attendanceRate !== undefined
                      ? `${stats.attendanceRate}%`
                      : "N/A"}
                  </span>
                </div>
                <Progress
                  value={stats?.attendanceRate || 0}
                  className="h-2 bg-white"
                />
              </div>

              {/* Meeting Completion Rate */}
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-200">
                    Meeting Completion
                  </span>
                  <span className="text-sm font-bold text-blue-400">
                    {stats?.meetingCompletionRate !== undefined
                      ? `${stats.meetingCompletionRate}%`
                      : "N/A"}
                  </span>
                </div>
                <Progress
                  value={stats?.meetingCompletionRate || 0}
                  className="h-2 bg-white"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Project Type Breakdown Card */}
        <motion.div variants={itemVariants}>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/15 rounded-xl">
                  <BookOpen className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Project Types
                  </h3>
                  <p className="text-sm text-slate-500">
                    {stats?.projectTypesCount || 0} types supervised
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {projectTypeBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {projectTypeBreakdown.map((pt, index) => {
                    const totalGroups = stats?.studentGroups || 1;
                    const percentage = Math.round(
                      (pt.groupCount / totalGroups) * 100
                    );
                    const colors = [
                      {
                        bg: "bg-blue-500/15",
                        text: "text-cyan-400",
                        bar: "bg-blue-500",
                      },
                      {
                        bg: "bg-amber-500/15",
                        text: "text-amber-400",
                        bar: "bg-amber-500",
                      },
                      {
                        bg: "bg-violet-100",
                        text: "text-violet-600",
                        bar: "bg-violet-500",
                      },
                      {
                        bg: "bg-blue-500/15",
                        text: "text-blue-400",
                        bar: "bg-blue-500",
                      },
                      {
                        bg: "bg-rose-100",
                        text: "text-rose-600",
                        bar: "bg-rose-500",
                      },
                    ];
                    const colorSet = colors[index % colors.length];

                    return (
                      <motion.div
                        key={pt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1.5 rounded-lg", colorSet.bg)}>
                              <FileText
                                className={cn("h-3.5 w-3.5", colorSet.text)}
                              />
                            </div>
                            <span className="text-sm font-medium text-slate-200">
                              {pt.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-white">
                            {pt.groupCount}{" "}
                            <span className="font-normal text-xs text-slate-400">
                              group{pt.groupCount !== 1 ? "s" : ""}
                            </span>
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{
                              delay: 0.5 + index * 0.1,
                              duration: 0.6,
                            }}
                            className={cn("h-1.5 rounded-full", colorSet.bar)}
                          />
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Summary */}
                  <div className="mt-4 pt-3 border-t border-blue-500/15">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total Groups</span>
                      <span className="font-bold text-white">
                        {stats?.studentGroups || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative mb-6"
                  >
                    <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl">
                      <BookOpen className="h-12 w-12 text-cyan-400" />
                    </div>
                  </motion.div>
                  <p className="text-slate-300 font-medium mb-1">
                    No project types yet
                  </p>
                  <p className="text-sm text-slate-400 text-center max-w-xs">
                    Project types will appear once groups are assigned
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}