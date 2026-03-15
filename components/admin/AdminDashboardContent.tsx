// /components/admin/AdminDashboardContent.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Shield,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Server,
  Database,
  Lock,
  MoreHorizontal,
  TrendingUp,
  FolderKanban,
  GraduationCap,
  Crown,
  UserCog,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdminDashboardContentProps {
  firstName: string;
  stats: {
    totalUsers: number;
    adminCount: number;
    facultyCount: number;
    studentCount: number;
    activeCount: number;
    inactiveCount: number;
  };
  projectStats: {
    totalProjects: number;
    totalProjectTypes: number;
    totalMembers: number;
    totalMeetings: number;
  };
  studentStats: {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    studentsInGroups: number;
  };
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

export function AdminDashboardContent({ firstName, stats, projectStats, studentStats }: AdminDashboardContentProps) {
  const systemStatuses = [
    { name: "All systems operational", status: "success", icon: CheckCircle2 },
    { name: "Database connected", status: "success", icon: Database },
    { name: "Auth service active", status: "success", icon: Lock },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* User Management Card - DYNAMIC */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full">
          <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/15 rounded-xl">
                <Users className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">User Management</h3>
                <p className="text-sm text-slate-500">Manage all users</p>
              </div>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-400 hover:bg-blue-500/10">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {[
                { role: "Admins", count: stats.adminCount, color: "rose", icon: Crown },
                { role: "Faculty", count: stats.facultyCount, color: "blue", icon: BookOpen },
                { role: "Students", count: stats.studentCount, color: "emerald", icon: GraduationCap },
              ].map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      item.color === "rose" && "bg-rose-100",
                      item.color === "blue" && "bg-blue-500/15",
                      item.color === "emerald" && "bg-blue-500/15"
                    )}>
                      <item.icon className={cn(
                        "h-3.5 w-3.5",
                        item.color === "rose" && "text-rose-600",
                        item.color === "blue" && "text-blue-400",
                        item.color === "emerald" && "text-cyan-400"
                      )} />
                    </div>
                    <span className="text-sm font-medium text-slate-200">{item.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      key={item.count}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-bold text-white text-lg"
                    >
                      {item.count}
                    </motion.span>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total & Active/Inactive */}
            <div className="mt-4 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-cyan-400">{stats.activeCount} active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-slate-300 rounded-full" />
                <span className="text-xs font-medium text-slate-500">{stats.inactiveCount} inactive</span>
              </div>
              <span className="text-sm font-bold text-cyan-400">{stats.totalUsers} total</span>
            </div>

            <Link href="/admin/users">
              <Button className="w-full mt-4 bg-blue-600 hover:bg-emerald-700 text-white">
                <UserCog className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Students Card - DYNAMIC */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full">
          <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <GraduationCap className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Students</h3>
                <p className="text-sm text-slate-500">Enrolled students</p>
              </div>
            </div>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: "Total Students", value: studentStats.totalStudents },
                { label: "Active", value: studentStats.activeStudents },
                { label: "In Project Groups", value: studentStats.studentsInGroups },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-blue-500/15 last:border-0"
                >
                  <span className="text-sm text-slate-300">{item.label}</span>
                  <motion.span
                    key={item.value}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-bold text-white"
                  >
                    {item.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>

            {/* Group participation rate */}
            <div className="mt-4 p-4 bg-violet-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-violet-700">Group Participation</span>
                <span className="text-xs font-bold text-violet-600">
                  {studentStats.totalStudents > 0
                    ? Math.round((studentStats.studentsInGroups / studentStats.totalStudents) * 100)
                    : 0}%
                </span>
              </div>
              <Progress
                value={studentStats.totalStudents > 0
                  ? (studentStats.studentsInGroups / studentStats.totalStudents) * 100
                  : 0}
                className="h-2 bg-violet-100"
              />
            </div>

            <Link href="/admin/students">
              <Button className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white">
                <GraduationCap className="h-4 w-4 mr-2" />
                Manage Students
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* System Overview Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full">
          <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/15 rounded-xl">
                <Server className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">System Overview</h3>
                <p className="text-sm text-slate-500">Monitor activity</p>
              </div>
            </div>
            <Badge className="bg-blue-500/15 text-cyan-400 border-cyan-500/25">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse" />
              Online
            </Badge>
          </div>

          <div className="p-6">
            <div className="space-y-3">
              {systemStatuses.map((status, index) => (
                <motion.div
                  key={status.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl",
                    status.status === "success" ? "bg-blue-500/10" : "bg-amber-500/10"
                  )}
                >
                  <status.icon className={cn(
                    "h-4 w-4",
                    status.status === "success" ? "text-cyan-400" : "text-amber-400"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    status.status === "success" ? "text-cyan-400" : "text-amber-400"
                  )}>
                    {status.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* System Health */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-cyan-400">System Health</span>
                <span className="text-lg font-bold text-cyan-400">100%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex-1 h-8 bg-blue-500 rounded origin-bottom"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Projects Card - DYNAMIC (Full Width) */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/15 rounded-xl">
                <FolderKanban className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Projects Overview</h3>
                <p className="text-sm text-slate-500">Active project groups</p>
              </div>
            </div>
            <Link href="/admin/projects">
              <Button variant="outline" size="sm" className="border-blue-500/20">
                View All Projects
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Projects", value: projectStats.totalProjects, icon: FolderKanban, color: "blue" },
                { label: "Project Types", value: projectStats.totalProjectTypes, icon: BookOpen, color: "violet" },
                { label: "Group Members", value: projectStats.totalMembers, icon: Users, color: "emerald" },
                { label: "Meetings", value: projectStats.totalMeetings, icon: Clock, color: "amber" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className={cn(
                    "p-2 rounded-lg w-fit mx-auto mb-2",
                    stat.color === "blue" && "bg-blue-500/15",
                    stat.color === "violet" && "bg-violet-100",
                    stat.color === "emerald" && "bg-blue-500/15",
                    stat.color === "amber" && "bg-amber-500/15",
                  )}>
                    <stat.icon className={cn(
                      "h-4 w-4",
                      stat.color === "blue" && "text-blue-400",
                      stat.color === "violet" && "text-violet-600",
                      stat.color === "emerald" && "text-cyan-400",
                      stat.color === "amber" && "text-amber-400",
                    )} />
                  </div>
                  <motion.p
                    key={stat.value}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-white"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Card - DYNAMIC */}
      <motion.div variants={itemVariants}>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden h-full">
          <div className="p-6 border-b border-blue-500/15">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/5 rounded-xl">
                <TrendingUp className="h-5 w-5 text-slate-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Quick Stats</h3>
                <p className="text-sm text-slate-500">System overview</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: "Total Users", value: String(stats.totalUsers), icon: Users, color: "emerald" },
              { label: "Active Users", value: String(stats.activeCount), icon: Activity, color: "blue" },
              { label: "Total Projects", value: String(projectStats.totalProjects), icon: FolderKanban, color: "amber" },
              { label: "Total Meetings", value: String(projectStats.totalMeetings), icon: Clock, color: "emerald" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    stat.color === "emerald" && "bg-blue-500/15",
                    stat.color === "blue" && "bg-blue-500/15",
                    stat.color === "amber" && "bg-amber-500/15",
                  )}>
                    <stat.icon className={cn(
                      "h-4 w-4",
                      stat.color === "emerald" && "text-cyan-400",
                      stat.color === "blue" && "text-blue-400",
                      stat.color === "amber" && "text-amber-400",
                    )} />
                  </div>
                  <span className="text-sm text-slate-300">{stat.label}</span>
                </div>
                <span className="font-bold text-white">{stat.value}</span>
              </motion.div>
            ))}

            {/* Reports shortcut */}
            <Link href="/admin/reports">
              <Button variant="outline" className="w-full border-blue-500/20 hover:bg-white/5 mt-2">
                <FileText className="h-4 w-4 mr-2" />
                View Reports
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}