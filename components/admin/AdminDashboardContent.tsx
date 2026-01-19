// /components/admin/AdminDashboardContent.tsx
"use client";

import { motion } from "framer-motion";
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
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdminDashboardContentProps {
  firstName: string;
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

export function AdminDashboardContent({ firstName }: AdminDashboardContentProps) {
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
      {/* User Management Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-violet-100 rounded-xl">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">User Management</h3>
                <p className="text-sm text-slate-500">Manage all users</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {[
                { role: "Admins", count: 0, color: "violet" },
                { role: "Faculty", count: 0, color: "blue" },
                { role: "Students", count: 0, color: "emerald" },
              ].map((item, index) => (
                <motion.div
                  key={item.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      item.color === "violet" && "bg-violet-500",
                      item.color === "blue" && "bg-blue-500",
                      item.color === "emerald" && "bg-emerald-500"
                    )} />
                    <span className="text-sm font-medium text-slate-700">{item.role}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.count}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white">
              <Users className="h-4 w-4 mr-2" />
              Manage Users
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Course Management Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-xl">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Course Management</h3>
                <p className="text-sm text-slate-500">Oversee all courses</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700 hover:bg-violet-50">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {[
                { label: "Active Courses", value: 0 },
                { label: "Project Types", value: 0 },
                { label: "Enrollments", value: 0 },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-slate-600">{item.label}</span>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-700">Course Capacity</span>
                <span className="text-xs font-bold text-blue-600">0%</span>
              </div>
              <Progress value={0} className="h-2 bg-blue-100" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* System Overview Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <Server className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">System Overview</h3>
                <p className="text-sm text-slate-500">Monitor activity</p>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse" />
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
                    status.status === "success" ? "bg-emerald-50" : "bg-amber-50"
                  )}
                >
                  <status.icon className={cn(
                    "h-4 w-4",
                    status.status === "success" ? "text-emerald-600" : "text-amber-600"
                  )} />
                  <span className={cn(
                    "text-sm font-medium",
                    status.status === "success" ? "text-emerald-700" : "text-amber-700"
                  )}>
                    {status.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* System Health */}
            <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-violet-700">System Health</span>
                <span className="text-lg font-bold text-violet-600">100%</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex-1 h-8 bg-violet-500 rounded origin-bottom"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity - Full Width */}
      <motion.div variants={itemVariants} className="lg:col-span-2">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Activity className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                <p className="text-sm text-slate-500">Latest system events</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-slate-200">
              View All
            </Button>
          </div>

          <div className="p-6">
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative mb-6"
              >
                <div className="absolute inset-0 bg-amber-200 rounded-2xl blur-xl opacity-40" />
                <div className="relative bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                  <Activity className="h-12 w-12 text-amber-400" />
                </div>
              </motion.div>
              <p className="text-slate-600 font-medium mb-1">No recent activity</p>
              <p className="text-sm text-slate-400 text-center max-w-xs">
                System activity and events will appear here as they occur
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Quick Stats</h3>
                <p className="text-sm text-slate-500">System overview</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: "Total Sessions Today", value: "0", icon: Activity, color: "violet" },
              { label: "Active Users", value: "0", icon: Users, color: "blue" },
              { label: "Pending Actions", value: "0", icon: Clock, color: "amber" },
              { label: "System Alerts", value: "0", icon: AlertTriangle, color: "emerald" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    stat.color === "violet" && "bg-violet-100",
                    stat.color === "blue" && "bg-blue-100",
                    stat.color === "amber" && "bg-amber-100",
                    stat.color === "emerald" && "bg-emerald-100"
                  )}>
                    <stat.icon className={cn(
                      "h-4 w-4",
                      stat.color === "violet" && "text-violet-600",
                      stat.color === "blue" && "text-blue-600",
                      stat.color === "amber" && "text-amber-600",
                      stat.color === "emerald" && "text-emerald-600"
                    )} />
                  </div>
                  <span className="text-sm text-slate-600">{stat.label}</span>
                </div>
                <span className="font-bold text-slate-900">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}