// /app/student/reports/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  FileText,
  Upload,
  Download,
  Eye,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ReportsPage() {
  const reportTypes = [
    { name: "Weekly Report", status: "pending", color: "from-orange-500 to-amber-500", bgColor: "from-orange-50 to-amber-50" },
    { name: "Mid-Term Report", status: "upcoming", color: "from-blue-500 to-indigo-500", bgColor: "from-blue-50 to-indigo-50" },
    { name: "Final Report", status: "upcoming", color: "from-purple-500 to-pink-500", bgColor: "from-purple-50 to-pink-50" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                Reports
              </span>
            </h1>
            <p className="text-slate-500">Submit and track your project reports</p>
          </div>
          <Button className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25">
            <Upload className="h-4 w-4 mr-2" />
            Upload Report
          </Button>
        </motion.div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {reportTypes.map((report, index) => (
            <motion.div
              key={report.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${report.bgColor} rounded-full blur-2xl opacity-50 -translate-y-1/2 translate-x-1/2`} />
              
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${report.color} shadow-lg mb-4`}>
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{report.name}</h3>
                <Badge 
                  variant="secondary" 
                  className={`${
                    report.status === 'pending' 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {report.status === 'pending' ? (
                    <Clock className="h-3 w-3 mr-1" />
                  ) : (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  )}
                  {report.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Submissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Submissions</h3>
          <div className="text-center py-12">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl mb-4">
                <FileText className="h-16 w-16 text-green-300 mx-auto" />
              </div>
            </motion.div>
            <p className="text-slate-500">No reports submitted yet</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}