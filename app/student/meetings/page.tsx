// /app/student/meetings/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Calendar,
  Plus,
  Video,
  Clock,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MeetingsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Meetings
              </span>
            </h1>
            <p className="text-slate-500">Schedule and manage your meetings with guides</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-white">
                Past
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl mb-6">
                    <Calendar className="h-20 w-20 text-blue-300 mx-auto" />
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Upcoming Meetings</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  You don&apos;t have any scheduled meetings. Schedule a meeting with your guide to discuss your project progress.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="past">
              <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
                <p className="text-slate-500">No past meetings</p>
              </div>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center">
                <p className="text-slate-500">No meetings found</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}