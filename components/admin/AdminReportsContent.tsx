// /components/admin/AdminReportsContent.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    FileText,
    Download,
    BarChart3,
    PieChart,
    TrendingUp,
    Calendar,
    Users,
    FolderKanban,
    GraduationCap,
    UserCog,
    Briefcase,
    Clock,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ReportStats {
    totalUsers: number;
    totalStudents: number;
    totalStaff: number;
    totalProjects: number;
    totalProjectTypes: number;
    totalMeetings: number;
    totalGroupMembers: number;
}

interface AdminReportsContentProps {
    stats: ReportStats;
}

const reportTypes = [
    {
        name: "User Analytics",
        description: "User registration and activity reports",
        icon: Users,
        color: "violet",
        href: "/admin/users",
    },
    {
        name: "Student Reports",
        description: "Student enrollment and group participation",
        icon: GraduationCap,
        color: "blue",
        href: "/admin/students",
    },
    {
        name: "Project Reports",
        description: "Project status and progress reports",
        icon: FolderKanban,
        color: "emerald",
        href: "/admin/projects",
    },
    {
        name: "System Overview",
        description: "Overall system metrics and health",
        icon: TrendingUp,
        color: "amber",
        href: "/admin/dashboard",
    },
];

export function AdminReportsContent({ stats }: AdminReportsContentProps) {
    // Compute some derived stats
    const avgMembersPerProject = stats.totalProjects > 0
        ? (stats.totalGroupMembers / stats.totalProjects).toFixed(1)
        : "0";
    const avgMeetingsPerProject = stats.totalProjects > 0
        ? (stats.totalMeetings / stats.totalProjects).toFixed(1)
        : "0";

    return (
        <div className="min-h-screen bg-[#050A14]">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                            Reports & Analytics
                        </h1>
                        <p className="text-slate-500">System-wide reports powered by live data</p>
                    </div>
                </motion.div>

                {/* Report Type Cards - Clickable navigations */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                    {reportTypes.map((report, index) => (
                        <Link key={report.name} href={report.href}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                                whileHover={{ y: -4 }}
                                className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-5 cursor-pointer hover:shadow-lg hover:border-violet-200 transition-all group h-full"
                            >
                                <div className={cn(
                                    "p-3 rounded-xl w-fit mb-4",
                                    report.color === "violet" && "bg-violet-100",
                                    report.color === "blue" && "bg-blue-500/15",
                                    report.color === "emerald" && "bg-blue-500/15",
                                    report.color === "amber" && "bg-amber-500/15"
                                )}>
                                    <report.icon className={cn(
                                        "h-5 w-5",
                                        report.color === "violet" && "text-violet-600",
                                        report.color === "blue" && "text-blue-400",
                                        report.color === "emerald" && "text-cyan-400",
                                        report.color === "amber" && "text-amber-400"
                                    )} />
                                </div>
                                <h3 className="font-semibold text-white mb-1 group-hover:text-violet-600 transition-colors flex items-center gap-1">
                                    {report.name}
                                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h3>
                                <p className="text-sm text-slate-500">{report.description}</p>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                {/* Main Reports — Dynamic Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="bg-white/5 border border-blue-500/20 p-1 mb-6">
                            <TabsTrigger value="overview" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="users" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                                <Users className="h-4 w-4 mr-2" />
                                Users
                            </TabsTrigger>
                            <TabsTrigger value="projects" className="data-[state=active]:bg-violet-50 data-[state=active]:text-violet-700">
                                <FolderKanban className="h-4 w-4 mr-2" />
                                Projects
                            </TabsTrigger>
                        </TabsList>

                        {/* OVERVIEW TAB */}
                        <TabsContent value="overview">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* System Summary - DYNAMIC */}
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden">
                                    <div className="p-6 border-b border-blue-500/15">
                                        <h3 className="font-semibold text-white">System Summary</h3>
                                        <p className="text-sm text-slate-500">Overview of all metrics</p>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        {[
                                            { label: "Total Users", value: stats.totalUsers, max: Math.max(stats.totalUsers, 10), color: "violet", icon: Users },
                                            { label: "Total Students", value: stats.totalStudents, max: Math.max(stats.totalStudents, 10), color: "blue", icon: GraduationCap },
                                            { label: "Total Staff", value: stats.totalStaff, max: Math.max(stats.totalStaff, 10), color: "emerald", icon: Briefcase },
                                            { label: "Active Projects", value: stats.totalProjects, max: Math.max(stats.totalProjects, 10), color: "amber", icon: FolderKanban },
                                            { label: "Total Meetings", value: stats.totalMeetings, max: Math.max(stats.totalMeetings, 10), color: "violet", icon: Calendar },
                                        ].map((item, index) => (
                                            <motion.div
                                                key={item.label}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.05 }}
                                            >
                                                <div className="flex justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className={cn(
                                                            "h-3.5 w-3.5",
                                                            item.color === "violet" && "text-violet-500",
                                                            item.color === "blue" && "text-blue-500",
                                                            item.color === "emerald" && "text-cyan-400",
                                                            item.color === "amber" && "text-amber-400",
                                                        )} />
                                                        <span className="text-sm text-slate-300">{item.label}</span>
                                                    </div>
                                                    <motion.span
                                                        key={item.value}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        className="text-sm font-bold text-white"
                                                    >
                                                        {item.value}
                                                    </motion.span>
                                                </div>
                                                <Progress value={(item.value / item.max) * 100} className="h-2" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Breakdown Chart (visual) */}
                                <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden">
                                    <div className="p-6 border-b border-blue-500/15">
                                        <h3 className="font-semibold text-white">Distribution</h3>
                                        <p className="text-sm text-slate-500">Data breakdown</p>
                                    </div>
                                    <div className="p-6">
                                        {/* Bar-style visualization */}
                                        <div className="space-y-4">
                                            {[
                                                { label: "Users", value: stats.totalUsers, color: "bg-violet-500" },
                                                { label: "Students", value: stats.totalStudents, color: "bg-blue-500" },
                                                { label: "Staff", value: stats.totalStaff, color: "bg-blue-500" },
                                                { label: "Projects", value: stats.totalProjects, color: "bg-amber-500" },
                                                { label: "Meetings", value: stats.totalMeetings, color: "bg-rose-500" },
                                                { label: "Group Members", value: stats.totalGroupMembers, color: "bg-indigo-500" },
                                            ].map((item, index) => {
                                                const maxVal = Math.max(
                                                    stats.totalUsers, stats.totalStudents, stats.totalStaff,
                                                    stats.totalProjects, stats.totalMeetings, stats.totalGroupMembers, 1
                                                );

                                                return (
                                                    <motion.div
                                                        key={item.label}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.3 + index * 0.05 }}
                                                    >
                                                        <div className="flex items-center justify-between mb-1.5">
                                                            <span className="text-sm text-slate-300">{item.label}</span>
                                                            <span className="text-sm font-bold text-white">{item.value}</span>
                                                        </div>
                                                        <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${Math.max((item.value / maxVal) * 100, 2)}%` }}
                                                                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                                                                className={cn("h-full rounded-full", item.color)}
                                                            />
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Insights */}
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-5"
                                >
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-1">Avg Members / Project</p>
                                    <p className="text-3xl font-bold text-white">{avgMembersPerProject}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Across {stats.totalProjects} project{stats.totalProjects !== 1 ? "s" : ""}
                                    </p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.45 }}
                                    className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-5"
                                >
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-1">Avg Meetings / Project</p>
                                    <p className="text-3xl font-bold text-white">{avgMeetingsPerProject}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {stats.totalMeetings} total meeting{stats.totalMeetings !== 1 ? "s" : ""}
                                    </p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-5"
                                >
                                    <p className="text-xs font-medium text-slate-400 uppercase mb-1">Project Types</p>
                                    <p className="text-3xl font-bold text-white">{stats.totalProjectTypes}</p>
                                    <p className="text-xs text-slate-500 mt-1">Active categories</p>
                                </motion.div>
                            </div>
                        </TabsContent>

                        {/* USERS TAB */}
                        <TabsContent value="users">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden">
                                <div className="p-6 border-b border-blue-500/15 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-white">User Report</h3>
                                        <p className="text-sm text-slate-500">Breakdown of registered users</p>
                                    </div>
                                    <Link href="/admin/users">
                                        <Button variant="outline" size="sm" className="border-blue-500/20">
                                            Manage Users
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="text-center p-6 bg-violet-50 rounded-xl">
                                            <Users className="h-8 w-8 text-violet-500 mx-auto mb-2" />
                                            <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                                            <p className="text-sm text-slate-500">Total Users</p>
                                        </div>
                                        <div className="text-center p-6 bg-blue-500/10 rounded-xl">
                                            <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                            <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                                            <p className="text-sm text-slate-500">Students</p>
                                        </div>
                                        <div className="text-center p-6 bg-blue-500/10 rounded-xl">
                                            <Briefcase className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
                                            <p className="text-3xl font-bold text-white">{stats.totalStaff}</p>
                                            <p className="text-sm text-slate-500">Staff Members</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* PROJECTS TAB */}
                        <TabsContent value="projects">
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 overflow-hidden">
                                <div className="p-6 border-b border-blue-500/15 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-white">Project Report</h3>
                                        <p className="text-sm text-slate-500">Breakdown of project groups</p>
                                    </div>
                                    <Link href="/admin/projects">
                                        <Button variant="outline" size="sm" className="border-blue-500/20">
                                            View Projects
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center p-5 bg-blue-500/10 rounded-xl">
                                            <FolderKanban className="h-7 w-7 text-blue-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-white">{stats.totalProjects}</p>
                                            <p className="text-xs text-slate-500">Projects</p>
                                        </div>
                                        <div className="text-center p-5 bg-violet-50 rounded-xl">
                                            <PieChart className="h-7 w-7 text-violet-500 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-white">{stats.totalProjectTypes}</p>
                                            <p className="text-xs text-slate-500">Types</p>
                                        </div>
                                        <div className="text-center p-5 bg-blue-500/10 rounded-xl">
                                            <Users className="h-7 w-7 text-cyan-400 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-white">{stats.totalGroupMembers}</p>
                                            <p className="text-xs text-slate-500">Members</p>
                                        </div>
                                        <div className="text-center p-5 bg-amber-500/10 rounded-xl">
                                            <Clock className="h-7 w-7 text-amber-400 mx-auto mb-2" />
                                            <p className="text-2xl font-bold text-white">{stats.totalMeetings}</p>
                                            <p className="text-xs text-slate-500">Meetings</p>
                                        </div>
                                    </div>

                                    {/* Insights */}
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <p className="text-xs text-slate-400 uppercase mb-1">Avg Members / Project</p>
                                            <p className="text-xl font-bold text-white">{avgMembersPerProject}</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-xl">
                                            <p className="text-xs text-slate-400 uppercase mb-1">Avg Meetings / Project</p>
                                            <p className="text-xl font-bold text-white">{avgMeetingsPerProject}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}