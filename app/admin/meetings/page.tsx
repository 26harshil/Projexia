// /app/admin/meetings/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Calendar,
  Plus,
  Search,
  Filter,
  Video,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MeetingsPage() {
  const today = new Date();
  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const meetingStats = [
    { label: "Today", value: "0", color: "violet" },
    { label: "This Week", value: "0", color: "blue" },
    { label: "This Month", value: "0", color: "emerald" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              Meetings
            </h1>
            <p className="text-slate-500">View and manage all scheduled meetings</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          {meetingStats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-white rounded-xl border border-slate-200 p-4 text-center"
            >
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{monthName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">Today</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, i) => {
                    const dayNum = i - 3 + 1;
                    const isToday = dayNum === today.getDate();
                    const isValidDay = dayNum > 0 && dayNum <= 30;
                    
                    return (
                      <motion.div
                        key={i}
                        whileHover={isValidDay ? { scale: 1.05 } : {}}
                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                          isToday
                            ? 'bg-violet-600 text-white font-semibold'
                            : isValidDay
                            ? 'text-slate-600 hover:bg-violet-50 cursor-pointer'
                            : 'text-slate-300'
                        }`}
                      >
                        {isValidDay ? dayNum : ''}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Meetings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden h-full">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Upcoming</h3>
                <p className="text-sm text-slate-500">Next 7 days</p>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-violet-50 border border-violet-100 p-4 rounded-xl mb-4"
                  >
                    <Calendar className="h-10 w-10 text-violet-400" />
                  </motion.div>
                  <p className="text-slate-500 text-sm">No upcoming meetings</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Meeting List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-100">
                All Meetings
              </TabsTrigger>
              <TabsTrigger value="online" className="data-[state=active]:bg-slate-100">
                <Video className="h-4 w-4 mr-2" />
                Online
              </TabsTrigger>
              <TabsTrigger value="inperson" className="data-[state=active]:bg-slate-100">
                <MapPin className="h-4 w-4 mr-2" />
                In-Person
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No meetings scheduled</p>
              </div>
            </TabsContent>
            
            <TabsContent value="online">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No online meetings</p>
              </div>
            </TabsContent>
            
            <TabsContent value="inperson">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No in-person meetings</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}