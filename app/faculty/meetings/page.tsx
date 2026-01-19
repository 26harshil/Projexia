// /app/faculty/reviews/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  ClipboardCheck, 
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReviewsPage() {
  const reviewStats = [
    { label: "Pending", count: 0, color: "amber", icon: Clock },
    { label: "In Progress", count: 0, color: "purple", icon: AlertCircle },
    { label: "Completed", count: 0, color: "emerald", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
            Project Reviews
          </h1>
          <p className="text-slate-500">Review and grade student project submissions</p>
        </motion.div>

        {/* Review Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {reviewStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${
                stat.color === 'amber' ? 'border-amber-100' :
                stat.color === 'purple' ? 'border-purple-100' :
                'border-emerald-100'
              }`}
            >
              <div className={`p-3 rounded-xl ${
                stat.color === 'amber' ? 'bg-amber-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-emerald-100'
              }`}>
                <stat.icon className={`h-5 w-5 ${
                  stat.color === 'amber' ? 'text-amber-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-emerald-600'
                }`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
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
                placeholder="Search reviews..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <Button variant="outline" className="border-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </motion.div>

        {/* Reviews Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger 
                value="pending" 
                className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-amber-50 border border-amber-100 p-8 rounded-2xl">
                      <ClipboardCheck className="h-16 w-16 text-amber-400 mx-auto" />
                    </div>
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Pending Reviews</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  All caught up! There are no project submissions waiting for your review.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No completed reviews</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}