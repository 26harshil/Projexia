// /app/admin/reports/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  FileText,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  Calendar,
  Users,
  FolderKanban,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const reportTypes = [
  { 
    name: "User Analytics", 
    description: "User registration and activity reports",
    icon: Users,
    color: "violet"
  },
  { 
    name: "Project Reports", 
    description: "Project status and progress reports",
    icon: FolderKanban,
    color: "blue"
  },
  { 
    name: "Meeting Reports", 
    description: "Meeting attendance and frequency",
    icon: Calendar,
    color: "emerald"
  },
  { 
    name: "Performance Reports", 
    description: "System performance metrics",
    icon: TrendingUp,
    color: "amber"
  },
];

export default function ReportsPage() {
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
              Reports & Analytics
            </h1>
            <p className="text-slate-500">Generate and view system-wide reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </motion.div>

        {/* Report Type Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-lg hover:border-violet-200 transition-all group"
            >
              <div className={cn(
                "p-3 rounded-xl w-fit mb-4",
                report.color === "violet" && "bg-violet-100",
                report.color === "blue" && "bg-blue-100",
                report.color === "emerald" && "bg-emerald-100",
                report.color === "amber" && "bg-amber-100"
              )}>
                <report.icon className={cn(
                  "h-5 w-5",
                  report.color === "violet" && "text-violet-600",
                  report.color === "blue" && "text-blue-600",
                  report.color === "emerald" && "text-emerald-600",
                  report.color === "amber" && "text-amber-600"
                )} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                {report.name}
              </h3>
              <p className="text-sm text-slate-500">{report.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Reports Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                <FolderKanban className="h-4 w-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="custom" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                <PieChart className="h-4 w-4 mr-2" />
                Custom
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Summary Card */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">System Summary</h3>
                    <p className="text-sm text-slate-500">Overview of all metrics</p>
                  </div>
                  <div className="p-6 space-y-4">
                    {[
                      { label: "Total Users", value: 0, max: 100, color: "violet" },
                      { label: "Active Projects", value: 0, max: 50, color: "blue" },
                      { label: "Meetings This Month", value: 0, max: 30, color: "emerald" },
                      { label: "Reports Generated", value: 0, max: 20, color: "amber" },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-600">{item.label}</span>
                          <span className="text-sm font-semibold text-slate-900">{item.value}</span>
                        </div>
                        <Progress value={(item.value / item.max) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900">Activity Chart</h3>
                    <p className="text-sm text-slate-500">Last 30 days activity</p>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col items-center justify-center py-12">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-violet-50 border border-violet-100 p-6 rounded-xl mb-4"
                      >
                        <BarChart3 className="h-12 w-12 text-violet-400" />
                      </motion.div>
                      <p className="text-slate-500 text-sm">No data to display</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-900">Recent Reports</h3>
                  <p className="text-sm text-slate-500">Recently generated reports</p>
                </div>
                <div className="p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block mb-6"
                  >
                    <div className="bg-violet-50 border border-violet-100 p-8 rounded-2xl">
                      <FileText className="h-16 w-16 text-violet-400 mx-auto" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Reports Generated</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Generate your first report to see it here. Reports help you analyze system data and make informed decisions.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No user reports available</p>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No project reports available</p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">Custom report builder coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}