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
  MoreHorizontal,
  MapPin,
  Crown,
  FolderKanban,
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
  attendanceRate: number;
  assignedCourses: number;
  recentGroups: RecentGroup[];
  upcomingMeetingsList: UpcomingMeeting[];
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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function FacultyDashboardContent({ firstName, stats }: FacultyDashboardContentProps) {
  const recentGroups = stats?.recentGroups || [];
  const upcomingMeetings = stats?.upcomingMeetingsList || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* My Courses Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 rounded-xl">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">My Courses</h3>
                <p className="text-sm text-slate-500">Courses you're teaching</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-purple-200 rounded-2xl blur-xl opacity-40" />
                <div className="relative bg-purple-50 border border-purple-100 p-6 rounded-2xl">
                  <BookOpen className="h-12 w-12 text-purple-400" />
                </div>
              </motion.div>
              <p className="text-slate-600 font-medium mb-1">
                {stats?.assignedCourses || 0} Courses Assigned
              </p>
              <p className="text-sm text-slate-400 text-center max-w-xs mb-4">
                Courses will appear here once assigned by the administrator
              </p>
              <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                Request Assignment
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Student Groups Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Student Groups</h3>
                <p className="text-sm text-slate-500">
                  {stats?.studentGroups || 0} groups under your supervision
                </p>
              </div>
            </div>
            <Link href="/faculty/group">
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {recentGroups.length > 0 ? (
              <div className="space-y-3">
                {recentGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <FolderKanban className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm truncate">
                        {group.title || group.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.memberCount} members
                        </span>
                        {group.projectType && (
                          <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-600">
                            {group.projectType}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {group.leaderName && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Crown className="h-3 w-3" />
                        <span className="truncate max-w-[80px]">{group.leaderName}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 bg-amber-200 rounded-2xl blur-xl opacity-40" />
                  <div className="relative bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                    <Users className="h-12 w-12 text-amber-400" />
                  </div>
                </motion.div>
                <p className="text-slate-600 font-medium mb-1">No groups assigned yet</p>
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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Meeting Schedule</h3>
                <p className="text-sm text-slate-500">Upcoming meetings with students</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
              {stats?.todayMeetings || 0} Today
            </Badge>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {upcomingMeetings.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeetings.map((meeting, index) => {
                  const meetingDate = new Date(meeting.datetime);
                  const isToday = meetingDate.toDateString() === new Date().toDateString();
                  const isTomorrow = meetingDate.toDateString() ===
                    new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

                  return (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl transition-colors",
                        isToday
                          ? "bg-emerald-50 border border-emerald-100"
                          : "bg-slate-50 hover:bg-slate-100"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-lg text-center min-w-[50px]",
                        isToday ? "bg-emerald-100" : "bg-slate-200"
                      )}>
                        <p className={cn(
                          "text-xs font-medium",
                          isToday ? "text-emerald-600" : "text-slate-600"
                        )}>
                          {isToday ? "Today" : isTomorrow ? "Tomorrow" : meetingDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {meetingDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">
                          {meeting.purpose || "Project Meeting"}
                        </p>
                        <p className="text-xs text-purple-600 truncate">
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
                        <Badge className="bg-emerald-600 text-white text-xs">Now</Badge>
                      )}
                    </motion.div>
                  );
                })}
                <Link href="/faculty/meetings" className="block">
                  <Button variant="outline" className="w-full mt-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                    View All Meetings
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="relative mb-6"
                >
                  <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-40" />
                  <div className="relative bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                    <Calendar className="h-12 w-12 text-emerald-400" />
                  </div>
                </motion.div>
                <p className="text-slate-600 font-medium mb-1">No meetings scheduled</p>
                <p className="text-sm text-slate-400 text-center max-w-xs mb-4">
                  Schedule meetings with your student groups
                </p>
                <Link href="/faculty/meetings">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full shadow-sm hover:shadow-md transition-shadow">
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <BarChart3 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Quick Stats</h3>
                <p className="text-sm text-slate-500">Your activity overview</p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="space-y-4">
              {[
                {
                  label: "Total Students",
                  value: stats?.totalStudents?.toString() || "0",
                  icon: Users,
                  color: "purple"
                },
                {
                  label: "Active Projects",
                  value: stats?.studentGroups?.toString() || "0",
                  icon: BookOpen,
                  color: "amber"
                },
                {
                  label: "Completed Meetings",
                  value: stats?.completedMeetings?.toString() || "0",
                  icon: CheckCircle2,
                  color: "emerald"
                },
                {
                  label: "Pending Reviews",
                  value: stats?.pendingReviews?.toString() || "0",
                  icon: AlertCircle,
                  color: "rose",
                  href: "/faculty/reviews"
                },
              ].map((stat, index) => {
                const StatWrapper = stat.href ? Link : 'div';
                return (
                  <StatWrapper key={stat.label} href={stat.href || " "}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          stat.color === "purple" && "bg-purple-100",
                          stat.color === "amber" && "bg-amber-100",
                          stat.color === "emerald" && "bg-emerald-100",
                          stat.color === "rose" && "bg-rose-100"
                        )}>
                          <stat.icon className={cn(
                            "h-4 w-4",
                            stat.color === "purple" && "text-purple-600",
                            stat.color === "amber" && "text-amber-600",
                            stat.color === "emerald" && "text-emerald-600",
                            stat.color === "rose" && "text-rose-600"
                          )} />
                        </div>
                        <span className="text-sm text-slate-600">{stat.label}</span>
                      </div>
                      <span className="font-bold text-slate-900">{stat.value}</span>
                    </motion.div>
                  </StatWrapper>
                );
              })}
            </div>

            {/* Attendance Rate */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-amber-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Attendance Rate</span>
                <span className="text-sm font-bold text-purple-600">
                  {stats?.attendanceRate !== undefined ? `${stats.attendanceRate}%` : "N/A"}
                </span>
              </div>
              <Progress value={stats?.attendanceRate || 0} className="h-2 bg-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
