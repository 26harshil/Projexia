// /components/dashboard/DashboardHeader.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Calendar,
  Clock
} from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
  role: string;
}

export function DashboardHeader({ userName, userEmail, role }: DashboardHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-[#050A14] border-b border-blue-500/15"
    >
      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-15 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Badge
                variant="secondary"
                className="bg-blue-500/15 text-blue-300 border border-blue-500/25 backdrop-blur-sm"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {role}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {userName}
              </span>
              ! 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400"
            >
              Track your projects, progress, and upcoming meetings
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 text-sm text-slate-400"
          >
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-blue-500/20 shadow-sm">
              <Calendar className="h-4 w-4 text-blue-400" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-cyan-500/20 shadow-sm">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{currentTime}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
