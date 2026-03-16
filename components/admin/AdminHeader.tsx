// /components/admin/AdminHeader.tsx
"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Settings,
  Activity,
  ChevronRight,
  Zap
} from "lucide-react";

interface AdminHeaderProps {
  userName: string;
  userEmail: string;
  role: string;
}

export function AdminHeader({ userName, userEmail, role }: AdminHeaderProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden bg-[#07111F] border-b border-blue-500/15"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%233B9EFF%22%20stroke-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-80 pointer-events-none" />

      {/* Animated Orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left Section */}
          <div className="space-y-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              <Badge className="bg-blue-500/15 text-blue-300 border border-blue-500/25 backdrop-blur-sm hover:bg-blue-500/20">
                <Shield className="h-3 w-3 mr-1.5" />
                {role} Panel
              </Badge>
              <Badge className="bg-cyan-500/15 text-cyan-300 border border-cyan-400/25">
                <Activity className="h-3 w-3 mr-1.5" />
                System Online
              </Badge>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-slate-400 text-sm mb-1">Welcome back,</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{userName}</span>! 👋
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-400 max-w-lg"
            >
              Here's an overview of your system. Manage users, monitor activity, and configure settings.
            </motion.p>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg shadow-blue-500/25 border-0">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/30 text-slate-300 hover:bg-blue-500/10 hover:text-white hover:border-blue-400/50 backdrop-blur-sm"
              >
                View Activity Log
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          </div>

          {/* Right Section - System Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-400/50" />
                  <span className="text-xs text-slate-400">Database</span>
                </div>
                <p className="text-white font-semibold">Connected</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-400/50" />
                  <span className="text-xs text-slate-400">Auth Service</span>
                </div>
                <p className="text-white font-semibold">Active</p>
              </div>
            </div>

            {/* Date */}
            <div className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4 flex items-center gap-3">
              <Zap className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs text-slate-400">Today</p>
                <p className="text-sm text-white font-medium">{currentDate}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
