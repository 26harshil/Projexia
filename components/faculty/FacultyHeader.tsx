// /components/faculty/FacultyHeader.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

interface FacultyHeaderProps {
  userName: string;
  userEmail: string;
  role: string;
}

export function FacultyHeader({ userName, userEmail, role }: FacultyHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-[#050A14] border-b border-blue-500/15"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%233B9EFF%22%20stroke-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-80 pointer-events-none" />

      {/* Decorative orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full blur-3xl opacity-8 -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section */}
          <div className="space-y-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="bg-blue-500/15 text-blue-300 border border-blue-500/25 hover:bg-blue-500/20">
                <Sparkles className="h-3 w-3 mr-1.5" />
                {role} Dashboard
              </Badge>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-slate-400 mb-1">{getGreeting()},</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{userName}</span>! 👋
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 max-w-md"
            >
              Manage your courses, student groups, and upcoming meetings from your dashboard.
            </motion.p>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Link href="/faculty/meetings">
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/25 border-0">
                  Schedule Meeting
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="/faculty/group">
                <Button
                  variant="outline"
                  className="border-blue-500/30 text-slate-300 hover:bg-blue-500/10 hover:text-white hover:border-blue-400/50 backdrop-blur-sm"
                >
                  View All Groups
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Section - Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {/* Date Card */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-blue-500/20 px-4 py-3 rounded-xl">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Today</p>
                <p className="text-sm font-medium text-white">{currentDate}</p>
              </div>
            </div>

            {/* Session Card */}
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-cyan-500/20 px-4 py-3 rounded-xl">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <Clock className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-cyan-400">Current Session</p>
                <p className="text-sm font-medium text-white">Academic 2024-25</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
