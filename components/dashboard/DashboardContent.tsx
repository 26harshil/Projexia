// /components/dashboard/DashboardContent.tsx
"use client";

import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Calendar, 
  Bell, 
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DashboardContentProps {
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

export function DashboardContent({ firstName }: DashboardContentProps) {
  const progressItems = [
    { name: "Project Proposal", progress: 0, color: "from-green-500 to-emerald-500" },
    { name: "Development", progress: 0, color: "from-blue-500 to-purple-500" },
    { name: "Final Report", progress: 0, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
      {/* My Projects - Large Card */}
      <motion.div
        variants={itemVariants}
        className="lg:col-span-2 group"
      >
        <div className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="p-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl shadow-lg shadow-purple-500/25"
                >
                  <FolderKanban className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">My Projects</h3>
                  <p className="text-sm text-slate-500">Your enrolled projects and their current status</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20" />
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl">
                  <FolderKanban className="h-16 w-16 text-purple-300" />
                </div>
              </motion.div>
              <p className="text-slate-600 mt-6 font-medium">No projects enrolled yet</p>
              <p className="text-sm text-slate-400 mt-1 text-center max-w-xs">
                Contact your faculty to get assigned to a project group
              </p>
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25">
                <Sparkles className="h-4 w-4 mr-2" />
                Explore Projects
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upcoming Meetings */}
      <motion.div variants={itemVariants}>
        <div className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full blur-2xl opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25"
              >
                <Calendar className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Upcoming Meetings</h3>
                <p className="text-sm text-slate-500">Your scheduled meetings</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl"
              >
                <Calendar className="h-12 w-12 text-blue-300" />
              </motion.div>
              <p className="text-slate-500 mt-4 text-sm">No meetings scheduled</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Progress Tracker */}
      <motion.div variants={itemVariants}>
        <div className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl shadow-lg shadow-green-500/25"
              >
                <CheckCircle2 className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Progress Tracker</h3>
                <p className="text-sm text-slate-500">Track your milestones</p>
              </div>
            </div>

            <div className="space-y-4">
              {progressItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="group/item"
                >
                  <div className="p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 hover:border-purple-200 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 text-slate-300" />
                        <p className="text-sm font-medium text-slate-700">{item.name}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {item.progress}%
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          item.color
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Team Members */}
      <motion.div variants={itemVariants}>
        <div className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full blur-2xl opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 bg-gradient-to-r from-pink-600 to-rose-500 rounded-xl shadow-lg shadow-pink-500/25"
              >
                <Users className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Team Members</h3>
                <p className="text-sm text-slate-500">Your project group</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-br from-pink-50 to-rose-50 p-4 rounded-xl"
              >
                <Users className="h-12 w-12 text-pink-300" />
              </motion.div>
              <p className="text-slate-500 mt-4 text-sm">No team assigned yet</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Announcements */}
      <motion.div variants={itemVariants}>
        <div className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-2xl opacity-50" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 15 }}
                className="p-3 bg-gradient-to-r from-orange-600 to-red-500 rounded-xl shadow-lg shadow-orange-500/25"
              >
                <Bell className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Announcements</h3>
                <p className="text-sm text-slate-500">Latest updates from guides</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8">
              <motion.div
                animate={{ 
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl"
              >
                <Bell className="h-12 w-12 text-orange-300" />
              </motion.div>
              <p className="text-slate-500 mt-4 text-sm">No announcements</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}