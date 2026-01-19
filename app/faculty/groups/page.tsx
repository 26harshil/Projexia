// /app/faculty/groups/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Plus, 
  Search,
  Filter,
  LayoutGrid,
  List,
  UserPlus,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GroupsPage() {
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
              My Groups
            </h1>
            <p className="text-slate-500">Manage student groups under your supervision</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Create Group
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search groups..." 
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-200">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <div className="flex border border-slate-200 rounded-lg p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-slate-100">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md">
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-1 mb-6">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
              >
                All Groups
              </TabsTrigger>
              <TabsTrigger 
                value="active"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
              >
                Active
              </TabsTrigger>
              <TabsTrigger 
                value="completed"
                className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
              >
                Completed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-amber-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-amber-50 border border-amber-100 p-8 rounded-2xl">
                      <Users className="h-16 w-16 text-amber-400 mx-auto" />
                    </div>
                  </div>
                </motion.div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Groups Yet</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                  You haven&apos;t been assigned any student groups yet. Create a new group or wait for assignments.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No active groups</p>
              </div>
            </TabsContent>
            
            <TabsContent value="completed">
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <p className="text-slate-500">No completed groups</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}