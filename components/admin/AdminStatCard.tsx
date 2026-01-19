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
  color: "violet" | "blue" | "emerald" | "amber";
  description: string;
  trend?: { value: string; positive: boolean };
  index?: number;
}

const colorStyles = {
  violet: {
    bg: "bg-violet-50",
    iconBg: "bg-violet-100",
    icon: "text-violet-600",
    border: "border-violet-100",
    accent: "bg-violet-600",
  },
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    border: "border-blue-100",
    accent: "bg-blue-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-100",
    icon: "text-emerald-600",
    border: "border-emerald-100",
    accent: "bg-emerald-600",
  },
  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-100",
    icon: "text-amber-600",
    border: "border-amber-100",
    accent: "bg-amber-600",
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
        "relative bg-white rounded-2xl border p-6 transition-all duration-300",
        "hover:shadow-xl hover:shadow-slate-200/50",
        "overflow-hidden"
      )}>
        {/* Background Decoration */}
        <div className={cn(
          "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-70",
          styles.bg
        )} />

        {/* Content */}
        <div className="relative z-10">
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
                  trend.positive 
                    ? "bg-emerald-50 text-emerald-600" 
                    : "bg-red-50 text-red-600"
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
            className="text-3xl font-bold text-slate-900 mb-1"
          >
            {value}
          </motion.h3>
          
          {/* Title & Description */}
          <p className="text-sm font-medium text-slate-700 mb-0.5">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>

        {/* Bottom Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1 origin-left",
            styles.accent
          )}
        />
      </div>
    </motion.div>
  );
}