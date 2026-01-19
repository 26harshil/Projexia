// /app/admin/master/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Settings2, 
  Plus, 
  Search,
  Database,
  Key,
  Globe,
  Mail,
  Shield,
  Server,
  Palette,
  Bell,
  ChevronRight,
  Lock,
  ToggleLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const configCategories = [
  { 
    id: "general", 
    name: "General Settings", 
    icon: Settings2, 
    color: "violet",
    description: "Basic system configuration"
  },
  { 
    id: "security", 
    name: "Security", 
    icon: Shield, 
    color: "red",
    description: "Authentication & permissions"
  },
  { 
    id: "database", 
    name: "Database", 
    icon: Database, 
    color: "blue",
    description: "Database connections"
  },
  { 
    id: "notifications", 
    name: "Notifications", 
    icon: Bell, 
    color: "amber",
    description: "Email & push settings"
  },
  { 
    id: "appearance", 
    name: "Appearance", 
    icon: Palette, 
    color: "pink",
    description: "Theme & branding"
  },
  { 
    id: "api", 
    name: "API Settings", 
    icon: Key, 
    color: "emerald",
    description: "API keys & integrations"
  },
];

export default function MasterConfigPage() {
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
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-violet-100 text-violet-700 border-violet-200">
                <Shield className="h-3 w-3 mr-1" />
                Admin Only
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              Master Configuration
            </h1>
            <p className="text-slate-500">Manage system-wide settings and configurations</p>
          </div>
          <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Configuration
          </Button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search configurations..." 
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
            />
          </div>
        </motion.div>

        {/* Config Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {configCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-lg hover:border-violet-200 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  category.color === "violet" && "bg-violet-100",
                  category.color === "red" && "bg-red-100",
                  category.color === "blue" && "bg-blue-100",
                  category.color === "amber" && "bg-amber-100",
                  category.color === "pink" && "bg-pink-100",
                  category.color === "emerald" && "bg-emerald-100"
                )}>
                  <category.icon className={cn(
                    "h-5 w-5",
                    category.color === "violet" && "text-violet-600",
                    category.color === "red" && "text-red-600",
                    category.color === "blue" && "text-blue-600",
                    category.color === "amber" && "text-amber-600",
                    category.color === "pink" && "text-pink-600",
                    category.color === "emerald" && "text-emerald-600"
                  )} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-500">{category.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-violet-500 transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Quick Settings</h3>
            <p className="text-sm text-slate-500">Toggle common system features</p>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              { name: "Maintenance Mode", description: "Temporarily disable access for non-admins", enabled: false, color: "red" },
              { name: "User Registration", description: "Allow new users to register", enabled: true, color: "emerald" },
              { name: "Email Notifications", description: "Send system notifications via email", enabled: true, color: "blue" },
              { name: "Two-Factor Authentication", description: "Require 2FA for all admin accounts", enabled: false, color: "amber" },
              { name: "API Access", description: "Enable external API access", enabled: true, color: "violet" },
            ].map((setting, index) => (
              <motion.div
                key={setting.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    setting.enabled ? "bg-emerald-500" : "bg-slate-300"
                  )} />
                  <div>
                    <p className="font-medium text-slate-900">{setting.name}</p>
                    <p className="text-sm text-slate-500">{setting.description}</p>
                  </div>
                </div>
                <Switch checked={setting.enabled} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}