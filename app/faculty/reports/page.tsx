// /app/faculty/reports/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  FileText,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  BarChart3,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export default function ReportsPage() {
  const reportStats = [
    { label: "Total Submissions", value: "0", icon: FileText, color: "purple" },
    { label: "Pending Review", value: "0", icon: Clock, color: "amber" },
    { label: "Approved", value: "0", icon: CheckCircle2, color: "emerald" },
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
              Reports
            </h1>
            <p className="text-slate-500">View and manage student report submissions</p>
          </div>
          <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {reportStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'purple' ? 'bg-purple-100' :
                  stat.color === 'amber' ? 'bg-amber-100' :
                  'bg-emerald-100'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === 'purple' ? 'text-purple-600' :
                    stat.color === 'amber' ? 'text-amber-600' :
                    'text-emerald-600'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search reports..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Button variant="outline" className="border-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </motion.div>

        {/* Reports Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-100">
                All Reports
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-slate-100">
                Weekly
              </TabsTrigger>
              <TabsTrigger value="midterm" className="data-[state=active]:bg-slate-100">
                Mid-Term
              </TabsTrigger>
              <TabsTrigger value="final" className="data-[state=active]:bg-slate-100">
                Final
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Overview Header */}
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-4">Submission Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Weekly Report', 'Mid-Term Report', 'Final Report'].map((type, i) => (
                      <div key={type} className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">{type}</span>
                          <span className="text-xs text-slate-500">0/0</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                <div className="p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block mb-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-200 rounded-2xl blur-xl opacity-40" />
                      <div className="relative bg-purple-50 border border-purple-100 p-8 rounded-2xl">
                        <FileText className="h-16 w-16 text-purple-400 mx-auto" />
                      </div>
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Reports Submitted</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Student reports will appear here once submitted. You&apos;ll be able to review and provide feedback.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No weekly reports</p>
              </div>
            </TabsContent>
            
            <TabsContent value="midterm">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No mid-term reports</p>
              </div>
            </TabsContent>
            
            <TabsContent value="final">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No final reports</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}