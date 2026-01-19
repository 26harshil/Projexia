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
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface FacultyDashboardContentProps {
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

export function FacultyDashboardContent({ firstName }: FacultyDashboardContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* My Courses Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
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
              <p className="text-slate-600 font-medium mb-1">No courses assigned yet</p>
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
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
          {/* Card Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Student Groups</h3>
                <p className="text-sm text-slate-500">Groups under your supervision</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Card Content */}
          <div className="p-6">
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
          </div>
        </div>
      </motion.div>

      {/* Meeting Schedule Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
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
              0 Today
            </Badge>
          </div>

          {/* Card Content */}
          <div className="p-6">
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
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Card */}
      <motion.div variants={itemVariants}>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
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
                { label: "Total Students", value: "0", icon: Users, color: "purple" },
                { label: "Active Projects", value: "0", icon: BookOpen, color: "amber" },
                { label: "Completed Meetings", value: "0", icon: CheckCircle2, color: "emerald" },
                { label: "Pending Reviews", value: "0", icon: AlertCircle, color: "rose" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
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
              ))}
            </div>

            {/* Attendance Rate */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-amber-50 rounded-xl border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Attendance Rate</span>
                <span className="text-sm font-bold text-purple-600">N/A</span>
              </div>
              <Progress value={0} className="h-2 bg-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}