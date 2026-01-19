// /app/admin/students/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Mail,
  UserCheck,
  UserX,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudentsPage() {
  const studentStats = [
    { label: "Total Students", value: "0", icon: Users, color: "violet" },
    { label: "Active", value: "0", icon: UserCheck, color: "emerald" },
    { label: "Inactive", value: "0", icon: UserX, color: "slate" },
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
              Students
            </h1>
            <p className="text-slate-500">Manage all registered students in the system</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-200">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {studentStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2 }}
              className="bg-white rounded-xl border border-slate-200 p-5"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${
                  stat.color === 'violet' ? 'bg-violet-100' :
                  stat.color === 'emerald' ? 'bg-emerald-100' :
                  'bg-slate-100'
                }`}>
                  <stat.icon className={`h-5 w-5 ${
                    stat.color === 'violet' ? 'text-violet-600' :
                    stat.color === 'emerald' ? 'text-emerald-600' :
                    'text-slate-600'
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
                placeholder="Search students by name, email, or ID..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-slate-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Students Table/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                All Students
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                Active
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                Pending
              </TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                Inactive
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                  <div className="col-span-4">Student</div>
                  <div className="col-span-2">ID</div>
                  <div className="col-span-2">Course</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                {/* Empty State */}
                <div className="p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="inline-block mb-6"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-violet-200 rounded-2xl blur-xl opacity-40" />
                      <div className="relative bg-violet-50 border border-violet-100 p-8 rounded-2xl">
                        <GraduationCap className="h-16 w-16 text-violet-400 mx-auto" />
                      </div>
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Students Found</h3>
                  <p className="text-slate-500 mb-6 max-w-md mx-auto">
                    There are no students registered in the system yet. Add students manually or import from a file.
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button variant="outline" className="border-violet-200 text-violet-600 hover:bg-violet-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Students
                    </Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Student
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No active students</p>
              </div>
            </TabsContent>
            
            <TabsContent value="pending">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No pending students</p>
              </div>
            </TabsContent>
            
            <TabsContent value="inactive">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No inactive students</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}




