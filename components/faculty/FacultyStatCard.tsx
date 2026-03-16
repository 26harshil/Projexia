// /components/faculty/FacultyStatCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  ClipboardCheck,
  ArrowUpRight,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  Users,
  Calendar,
  ClipboardCheck,
};

interface FacultyStatCardProps {
  title: string;
  value: string;
  iconName: string;
  color: "emerald" | "amber";
  description: string;
  trend?: string;
  index?: number;
}

// Mapped to dark blue/cyan theme
const colorStyles = {
  emerald: {
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/20",
    icon: "text-blue-300",
    border: "border-blue-500/20",
    trendStyle: "text-cyan-300 bg-cyan-500/10 border border-cyan-500/20",
    accent: "from-blue-500 to-cyan-400",
  },
  amber: {
    gradient: "from-cyan-500 to-teal-500",
    iconBg: "bg-cyan-500/20",
    icon: "text-cyan-300",
    border: "border-cyan-500/20",
    trendStyle: "text-teal-300 bg-teal-500/10 border border-teal-500/20",
    accent: "from-cyan-500 to-teal-400",
  },
};

export function FacultyStatCard({
  title,
  value,
  iconName,
  color,
  description,
  trend,
  index = 0
}: FacultyStatCardProps) {
  const Icon = iconMap[iconName] || BookOpen;
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <div className={cn(
        "relative bg-white/5 backdrop-blur-md rounded-2xl border p-6 transition-all duration-300",
        "hover:shadow-lg hover:border-cyan-400/35 hover:shadow-blue-900/20",
        styles.border,
        "overflow-hidden"
      )}>
        {/* Blob */}
        <div className={cn(
          "absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20 bg-gradient-to-br",
          styles.gradient
        )} />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={cn("p-3 rounded-xl bg-gradient-to-br shadow-lg", styles.gradient)}
          >
            <Icon className="h-5 w-5 text-white" />
          </motion.div>

          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                styles.trendStyle
              )}
            >
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="text-3xl font-bold text-white mb-1"
        >
          {value}
        </motion.h3>

        {/* Title & Description */}
        <p className="text-sm font-medium text-slate-300 mb-0.5">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>

        {/* Hover Indicator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-b-2xl bg-gradient-to-r",
            styles.accent
          )}
        />
      </div>
    </motion.div>
  );
}
