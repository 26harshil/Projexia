// /components/faculty/FacultyReportsContent.tsx
"use client";

import { motion } from "framer-motion";
import {
    FileText,
    Download,
    Eye,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    BarChart3,
    TrendingUp,
    FolderOpen,
    AlertCircle,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { generateFacultyReportPDF } from "@/lib/pdfGenerator";

interface GroupReport {
    groupId: number;
    groupName: string;
    projectTitle: string | null;
    leaderName: string | null;
    memberCount: number;
    totalMeetings: number;
    completedMeetings: number;
    pendingMeetings: number;
}

interface FacultyReportsContentProps {
    reports: GroupReport[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function FacultyReportsContent({ reports }: FacultyReportsContentProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredReports = reports.filter(
        (report) =>
            report.groupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalMeetings = reports.reduce((sum, r) => sum + r.totalMeetings, 0);
    const completedMeetings = reports.reduce((sum, r) => sum + r.completedMeetings, 0);
    const pendingMeetings = reports.reduce((sum, r) => sum + r.pendingMeetings, 0);
    const totalStudents = reports.reduce((sum, r) => sum + r.memberCount, 0);

    const reportStats = [
        {
            label: "Total Meetings",
            value: totalMeetings,
            icon: FileText,
            color: "emerald",
        },
        {
            label: "Pending Meetings",
            value: pendingMeetings,
            icon: Clock,
            color: "amber",
        },
        {
            label: "Total Students",
            value: totalStudents,
            icon: FolderOpen,
            color: "emerald",
        },
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
                            Reports
                        </h1>
                        <p className="text-slate-500">
                            View and manage student report submissions
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => generateFacultyReportPDF(reports)}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                    </Button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
                >
                    {reportStats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-xl border border-slate-200 p-4"
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-3 rounded-xl ${stat.color === "emerald"
                                        ? "bg-emerald-100"
                                        : stat.color === "amber"
                                            ? "bg-amber-100"
                                            : "bg-emerald-100"
                                        }`}
                                >
                                    <stat.icon
                                        className={`h-5 w-5 ${stat.color === "emerald"
                                            ? "text-emerald-600"
                                            : stat.color === "amber"
                                                ? "text-amber-600"
                                                : "text-emerald-600"
                                            }`}
                                    />
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
                                placeholder="Search reports..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                            />
                        </div>
                        <Button variant="outline" className="border-slate-200">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                    </div>
                </motion.div>

                {/* Reports Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-white border border-slate-200 p-1 mb-6">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-slate-100"
                            >
                                All Groups
                            </TabsTrigger>
                            <TabsTrigger
                                value="active"
                                className="data-[state=active]:bg-slate-100"
                            >
                                Active ({reports.filter(r => r.pendingMeetings > 0).length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="data-[state=active]:bg-slate-100"
                            >
                                Completed ({completedMeetings})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                {/* Overview Header */}
                                <div className="p-6 border-b border-slate-100">
                                    <h3 className="font-semibold text-slate-900 mb-4">
                                        Groups Overview
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { type: "Total Meetings", total: totalMeetings, color: "blue" },
                                            { type: "Completed", total: completedMeetings, color: "emerald" },
                                            { type: "Pending", total: pendingMeetings, color: "amber" },
                                        ].map((stat) => (
                                            <div key={stat.type} className="p-4 bg-slate-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {stat.type}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {stat.total} meetings
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={totalMeetings > 0 ? (stat.total / totalMeetings) * 100 : 0}
                                                    className="h-2"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Groups List */}
                                {filteredReports.length > 0 ? (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className="divide-y divide-slate-100"
                                    >
                                        {filteredReports.map((report) => (
                                            <GroupReportCard key={report.groupId} report={report} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <EmptyState />
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="active">
                            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                {reports.filter(r => r.pendingMeetings > 0).length > 0 ? (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className="divide-y divide-slate-100"
                                    >
                                        {filteredReports.filter(r => r.pendingMeetings > 0).map((report) => (
                                            <GroupReportCard key={report.groupId} report={report} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-slate-500">No groups with pending meetings</p>
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="completed">
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                {completedMeetings > 0 ? (
                                    <p className="text-slate-500">
                                        {completedMeetings} meetings completed across all groups
                                    </p>
                                ) : (
                                    <p className="text-slate-500">No completed meetings yet</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}

function GroupReportCard({ report }: { report: GroupReport }) {
    return (
        <motion.div variants={itemVariants}>
            <div className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Group Icon */}
                    <div className="shrink-0 p-3 bg-emerald-100 rounded-xl">
                        <FolderOpen className="h-5 w-5 text-emerald-600" />
                    </div>

                    {/* Group Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 mb-1">
                            {report.projectTitle || report.groupName}
                        </h3>
                        <p className="text-sm text-slate-500">{report.groupName}</p>
                        {report.leaderName && (
                            <p className="text-xs text-emerald-600">Leader: {report.leaderName}</p>
                        )}
                    </div>

                    {/* Meeting Counts */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="text-center px-3 py-1 bg-blue-50 rounded-lg">
                            <p className="text-lg font-bold text-blue-600">
                                {report.memberCount}
                            </p>
                            <p className="text-xs text-blue-500">Members</p>
                        </div>
                        <div className="text-center px-3 py-1 bg-emerald-50 rounded-lg">
                            <p className="text-lg font-bold text-emerald-600">
                                {report.totalMeetings}
                            </p>
                            <p className="text-xs text-emerald-500">Meetings</p>
                        </div>
                        <div className="text-center px-3 py-1 bg-emerald-50 rounded-lg">
                            <p className="text-lg font-bold text-emerald-600">
                                {report.completedMeetings}
                            </p>
                            <p className="text-xs text-emerald-500">Done</p>
                        </div>
                    </div>

                    {/* Pending Badge */}
                    {report.pendingMeetings > 0 && (
                        <Badge className="bg-amber-100 text-amber-700 shrink-0">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {report.pendingMeetings} pending
                        </Badge>
                    )}

                    {/* Actions */}
                    <Button variant="ghost" size="sm" className="text-emerald-600 shrink-0">
                        View <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState() {
    return (
        <div className="p-12 text-center">
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="inline-block mb-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-emerald-50 border border-emerald-100 p-8 rounded-2xl">
                        <FileText className="h-16 w-16 text-emerald-400 mx-auto" />
                    </div>
                </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No Reports Submitted
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
                Student reports will appear here once submitted. You&apos;ll be able to
                review and provide feedback.
            </p>
        </div>
    );
}
