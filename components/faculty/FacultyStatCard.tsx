// /components/faculty/FacultyStatCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  Calendar,
  ClipboardCheck,
  TrendingUp,
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

const colorStyles = {
  emerald: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    icon: "text-emerald-600",
    border: "border-emerald-100",
    trend: "text-emerald-600 bg-emerald-50",
  },
  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    icon: "text-amber-600",
    border: "border-amber-100",
    trend: "text-amber-600 bg-amber-50",
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
        "relative bg-white rounded-2xl border p-6 transition-all duration-300",
        "hover:shadow-lg hover:shadow-slate-200/50",
        styles.border
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400 }}
            className={cn("p-3 rounded-xl", styles.iconBg)}
          >
            <Icon className={cn("h-5 w-5", styles.icon)} />
          </motion.div>

          {trend && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                styles.trend
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
          className="text-3xl font-bold text-slate-900 mb-1"
        >
          {value}
        </motion.h3>

        {/* Title & Description */}
        <p className="text-sm font-medium text-slate-700 mb-0.5">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>

        {/* Hover Indicator */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-b-2xl",
            color === "emerald" && "bg-emerald-600",
            color === "amber" && "bg-amber-500",
            color === "emerald" && "bg-emerald-500",
            color === "emerald" && "bg-emerald-500"
          )}
        />
      </div>
    </motion.div>
  );
}
