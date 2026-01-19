// /app/student/project/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  FolderKanban, 
  Plus, 
  Search,
  Filter,
  LayoutGrid,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProjectPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            My{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-slate-500">Manage and track your project progress</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search projects..." 
              className="pl-10 bg-white border-slate-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="icon" className="border-slate-200">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="border-slate-200">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl mb-6">
              <FolderKanban className="h-20 w-20 text-purple-300 mx-auto" />
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Projects Yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven&apos;t been assigned to any projects yet. Contact your faculty or wait for project assignments.
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25">
            <Plus className="h-4 w-4 mr-2" />
            Request Project Assignment
          </Button>
        </motion.div>
      </div>
    </div>
  );
}