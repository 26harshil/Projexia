// /components/dashboard/StatCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  TrendingUp,
  Calendar,
  Bell,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  FolderKanban,
  TrendingUp,
  Calendar,
  Bell,
};

// Map old gradient keys to new blue/cyan dark-theme gradients
const gradientMap: Record<string, string> = {
  "from-green-500 to-cyan-600": "from-blue-500 to-cyan-500",
  "from-blue-500 to-emerald-600": "from-blue-600 to-indigo-500",
  "from-emerald-500 to-teal-600": "from-cyan-500 to-teal-500",
  "from-orange-500 to-red-600": "from-blue-500 to-cyan-400",
};

interface StatCardProps {
  title: string;
  value: string;
  iconName: string;
  gradient: string;
  description: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  iconName,
  gradient,
  description,
  index = 0
}: StatCardProps) {
  const Icon = iconMap[iconName] || FolderKanban;
  const mappedGradient = gradientMap[gradient] || "from-blue-500 to-cyan-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{
        scale: 1.02,
        y: -5,
      }}
      className="group relative"
    >
      {/* Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className={cn(
          "absolute inset-0 bg-gradient-to-r rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
          mappedGradient
        )}
      />

      <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 hover:border-cyan-400/40 hover:shadow-xl hover:shadow-blue-900/30 transition-all duration-500 overflow-hidden">
        {/* Background glow blob */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-full blur-2xl opacity-10 -translate-y-1/2 translate-x-1/2",
          mappedGradient
        )} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
              className={cn(
                "p-3 rounded-xl bg-gradient-to-r shadow-lg",
                mappedGradient
              )}
            >
              <Icon className="h-5 w-5 text-white" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
              className="flex items-center gap-1 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-full"
            >
              <TrendingUp className="h-3 w-3" />
              <span>+0%</span>
            </motion.div>
          </div>

          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="text-3xl font-bold text-white mb-1"
          >
            {value}
          </motion.h3>

          <p className="text-sm font-medium text-slate-300 mb-1">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>

        {/* Animated Border */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r origin-left",
            mappedGradient
          )}
        />
      </div>
    </motion.div>
  );
}
