// /app/student/group/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus,
  Mail,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function GroupPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100/40 via-white to-white pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            My{" "}
            <span className="bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
              Group
            </span>
          </h1>
          <p className="text-slate-500">Collaborate with your team members</p>
        </motion.div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 p-12 shadow-sm text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block"
          >
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-2xl mb-6">
              <Users className="h-20 w-20 text-pink-300 mx-auto" />
            </div>
          </motion.div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Team Assigned</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven&apos;t been assigned to a project group yet. Once assigned, you&apos;ll see your team members here.
          </p>
          
          {/* Placeholder Team Avatars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <Avatar className="h-12 w-12 border-2 border-dashed border-slate-200">
                  <AvatarFallback className="bg-slate-50 text-slate-300">?</AvatarFallback>
                </Avatar>
              </motion.div>
            ))}
          </div>
          
          <Button className="bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white shadow-lg shadow-pink-500/25">
            <UserPlus className="h-4 w-4 mr-2" />
            Join a Group
          </Button>
        </motion.div>
      </div>
    </div>
  );
}