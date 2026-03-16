// /components/admin/AdminStatCard.tsx
"use client";

import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  FolderKanban,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Users,
  BookOpen,
  FolderKanban,
  Activity,
};

interface AdminStatCardProps {
  title: string;
  value: string;
  iconName: string;
  color: "emerald" | "blue" | "amber";
  description: string;
  trend?: { value: string; positive: boolean };
  index?: number;
}

// Dark-theme color styles – all use blue/cyan tones
const colorStyles = {
  emerald: {
    gradient: "from-blue-500 to-cyan-500",
    iconBg: "bg-blue-500/20",
    icon: "text-blue-300",
    border: "border-blue-500/25",
    glowColor: "shadow-blue-900/30",
    accent: "from-blue-500 to-cyan-400",
  },
  blue: {
    gradient: "from-indigo-500 to-blue-500",
    iconBg: "bg-indigo-500/20",
    icon: "text-indigo-300",
    border: "border-indigo-500/25",
    glowColor: "shadow-indigo-900/30",
    accent: "from-indigo-500 to-blue-400",
  },
  amber: {
    gradient: "from-cyan-500 to-teal-500",
    iconBg: "bg-cyan-500/20",
    icon: "text-cyan-300",
    border: "border-cyan-500/25",
    glowColor: "shadow-cyan-900/30",
    accent: "from-cyan-500 to-teal-400",
  },
};

export function AdminStatCard({
  title,
  value,
  iconName,
  color,
  description,
  trend,
  index = 0
}: AdminStatCardProps) {
  const Icon = iconMap[iconName] || Users;
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <div className={cn(
        "relative bg-white/5 backdrop-blur-md rounded-2xl border p-6 transition-all duration-300",
        "hover:shadow-xl hover:border-cyan-400/30",
        styles.border,
        styles.glowColor,
        "overflow-hidden"
      )}>
        {/* Background blob */}
        <div className={cn(
          "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-25 bg-gradient-to-br",
          styles.gradient
        )} />

        {/* Content */}
        <div className="relative z-10">
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
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                  trend.positive
                    ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                )}
              >
                {trend.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {trend.value}
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
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-gradient-to-r",
            styles.accent
          )}
        />
      </div>
    </motion.div>
  );
}
