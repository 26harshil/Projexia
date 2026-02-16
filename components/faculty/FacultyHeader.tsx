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
      className="relative overflow-hidden bg-white border-b border-slate-100"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2" />

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
              <Badge 
                className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              >
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
              <p className="text-sm text-slate-500 mb-1">{getGreeting()},</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {userName}! 👋
              </h1>
            </motion.div>
            
            {/* Description */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 max-w-md"
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
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              >
                Schedule Meeting
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
              <Button 
                variant="outline" 
                className="border-slate-200 hover:bg-slate-50"
              >
                View All Groups
              </Button>
            </motion.div>
          </div>

          {/* Right Section - Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            {/* Date Card */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-3 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Calendar className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Today</p>
                <p className="text-sm font-medium text-slate-900">{currentDate}</p>
              </div>
            </div>

            {/* Time Card */}
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-600">Current Session</p>
                <p className="text-sm font-medium text-amber-700">Academic 2024-25</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
