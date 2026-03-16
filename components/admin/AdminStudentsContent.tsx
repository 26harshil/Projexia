// /components/admin/AdminStudentsContent.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    Filter,
    Download,
    Upload,
    Mail,
    UserCheck,
    UserX,
    GraduationCap,
    FolderKanban,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    Phone,
    Calendar,
    Hash,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Student = {
    studentid: number;
    studentname: string;
    phone: string | null;
    email: string | null;
    description: string | null;
    created: Date;
    modified: Date | null;
    userid: number | null;
    users: {
        role: string;
        isactive: boolean;
        clerkid: string;
    } | null;
    projectgroupmember: {
        isgroupleader: boolean;
        projectgroup: {
            projectgroupname: string;
            projecttitle: string | null;
        };
    }[];
};

type Stats = {
    totalStudents: number;
    activeStudents: number;
    inactiveStudents: number;
    studentsInGroups: number;
};

interface AdminStudentsContentProps {
    initialStudents: Student[];
    initialStats: Stats;
}

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE" | "IN_GROUP" | "NO_GROUP";

export function AdminStudentsContent({ initialStudents, initialStats }: AdminStudentsContentProps) {
    const [students] = useState<Student[]>(initialStudents);
    const [stats] = useState<Stats>(initialStats);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [expandedStudentId, setExpandedStudentId] = useState<number | null>(null);

    const filteredStudents = useMemo(() => {
        return students.filter((student) => {
            // Search match
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                !query ||
                student.studentname.toLowerCase().includes(query) ||
                (student.email && student.email.toLowerCase().includes(query)) ||
                (student.phone && student.phone.includes(query));

            // Status filter
            let matchesStatus = true;
            if (statusFilter === "ACTIVE") {
                matchesStatus = student.users?.isactive ?? false;
            } else if (statusFilter === "INACTIVE") {
                matchesStatus = !(student.users?.isactive ?? true);
            } else if (statusFilter === "IN_GROUP") {
                matchesStatus = student.projectgroupmember.length > 0;
            } else if (statusFilter === "NO_GROUP") {
                matchesStatus = student.projectgroupmember.length === 0;
            }

            return matchesSearch && matchesStatus;
        });
    }, [students, searchQuery, statusFilter]);

    const statCards = [
        { label: "Total Students", value: stats.totalStudents, icon: Users, color: "violet" },
        { label: "Active", value: stats.activeStudents, icon: UserCheck, color: "emerald" },
        { label: "Inactive", value: stats.inactiveStudents, icon: UserX, color: "slate" },
        { label: "In Groups", value: stats.studentsInGroups, icon: FolderKanban, color: "blue" },
    ];

    const filterOptions: { label: string; value: StatusFilter }[] = [
        { label: "All", value: "ALL" },
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
        { label: "In Group", value: "IN_GROUP" },
        { label: "No Group", value: "NO_GROUP" },
    ];

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
                            Students
                        </h1>
                        <p className="text-slate-500">
                            Manage all registered students in the system
                            <span className="ml-2 text-sm text-slate-400">({filteredStudents.length} showing)</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-blue-500/20">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ y: -2 }}
                            className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-5"
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === "violet" && "bg-violet-100",
                                    stat.color === "emerald" && "bg-blue-500/15",
                                    stat.color === "slate" && "bg-white/5",
                                    stat.color === "blue" && "bg-blue-500/15",
                                )}>
                                    <stat.icon className={cn(
                                        "h-5 w-5",
                                        stat.color === "violet" && "text-violet-600",
                                        stat.color === "emerald" && "text-cyan-400",
                                        stat.color === "slate" && "text-slate-300",
                                        stat.color === "blue" && "text-blue-400",
                                    )} />
                                </div>
                                <div>
                                    <motion.p
                                        key={stat.value}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-2xl font-bold text-white"
                                    >
                                        {stat.value}
                                    </motion.p>
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
                    className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 mb-6"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search students by name, email, or phone..."
                                className="pl-10 bg-white/5 border-blue-500/20 focus:bg-white/10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter pills */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {filterOptions.map((f) => (
                            <button
                                key={f.value}
                                onClick={() => setStatusFilter(f.value)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                    statusFilter === f.value
                                        ? "bg-violet-100 text-violet-700 ring-1 ring-violet-300"
                                        : "bg-white/5 text-slate-300 hover:bg-slate-200"
                                )}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Students List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Student</div>
                        <div className="col-span-2">Contact</div>
                        <div className="col-span-3">Project Group</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Details</div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {filteredStudents.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-12 text-center"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="inline-block mb-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-violet-200 rounded-2xl blur-xl opacity-40" />
                                        <div className="relative bg-violet-50 border border-violet-100 p-8 rounded-2xl">
                                            <GraduationCap className="h-16 w-16 text-violet-400 mx-auto" />
                                        </div>
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Students Found</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    {searchQuery || statusFilter !== "ALL"
                                        ? "No students match your current search or filter criteria."
                                        : "There are no students registered in the system yet."}
                                </p>
                                {(searchQuery || statusFilter !== "ALL") && (
                                    <Button
                                        variant="outline"
                                        onClick={() => { setSearchQuery(""); setStatusFilter("ALL"); }}
                                        className="border-violet-200 text-violet-600 hover:bg-violet-50"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </motion.div>
                        ) : (
                            filteredStudents.map((student, index) => {
                                const isExpanded = expandedStudentId === student.studentid;
                                const isActive = student.users?.isactive ?? false;
                                const hasGroup = student.projectgroupmember.length > 0;

                                return (
                                    <motion.div
                                        key={student.studentid}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:p-5 items-center cursor-pointer"
                                            onClick={() => setExpandedStudentId(isExpanded ? null : student.studentid)}
                                        >
                                            {/* Student Info */}
                                            <div className="col-span-4 flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                                                    {student.studentname.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white text-sm">{student.studentname}</p>
                                                    <p className="text-xs text-slate-500">ID: {student.studentid}</p>
                                                </div>
                                            </div>

                                            {/* Contact */}
                                            <div className="col-span-2">
                                                {student.email && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                                                        <Mail className="h-3 w-3 text-slate-400" />
                                                        <span className="truncate max-w-[150px]">{student.email}</span>
                                                    </div>
                                                )}
                                                {student.phone && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                                        <Phone className="h-3 w-3 text-slate-400" />
                                                        <span>{student.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Project Group */}
                                            <div className="col-span-3">
                                                {hasGroup ? (
                                                    <div className="space-y-1">
                                                        {student.projectgroupmember.slice(0, 1).map((m, i) => (
                                                            <div key={i} className="flex items-center gap-2">
                                                                <FolderKanban className="h-3.5 w-3.5 text-blue-500" />
                                                                <span className="text-xs text-slate-200 font-medium truncate max-w-[180px]">
                                                                    {m.projectgroup.projectgroupname}
                                                                </span>
                                                                {m.isgroupleader && (
                                                                    <Badge className="bg-amber-500/15 text-amber-400 text-[10px] px-1.5 py-0">
                                                                        Leader
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {student.projectgroupmember.length > 1 && (
                                                            <span className="text-[10px] text-slate-400">
                                                                +{student.projectgroupmember.length - 1} more
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 italic">No group assigned</span>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="col-span-2">
                                                <Badge className={cn(
                                                    "text-[11px]",
                                                    isActive
                                                        ? "bg-blue-500/15 text-cyan-400 border-cyan-500/25"
                                                        : "bg-white/5 text-slate-500 border-blue-500/20"
                                                )}>
                                                    <span className={cn(
                                                        "w-1.5 h-1.5 rounded-full mr-1.5",
                                                        isActive ? "bg-blue-500" : "bg-slate-400"
                                                    )} />
                                                    {isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>

                                            {/* Expand */}
                                            <div className="col-span-1 text-right">
                                                {isExpanded ? (
                                                    <ChevronUp className="h-4 w-4 text-slate-400 inline" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4 text-slate-400 inline" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 pt-1 border-t border-blue-500/15">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Student ID</p>
                                                                <p className="text-sm font-mono text-slate-200">{student.studentid}</p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Joined</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {new Date(student.created).toLocaleDateString("en-US", {
                                                                        year: "numeric", month: "short", day: "numeric"
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Last Modified</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {student.modified
                                                                        ? new Date(student.modified).toLocaleDateString("en-US", {
                                                                            year: "numeric", month: "short", day: "numeric"
                                                                        })
                                                                        : "Never"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Project groups detail */}
                                                        {student.projectgroupmember.length > 0 && (
                                                            <div className="mt-4">
                                                                <p className="text-xs font-semibold text-slate-300 mb-2">Project Groups</p>
                                                                <div className="space-y-2">
                                                                    {student.projectgroupmember.map((m, i) => (
                                                                        <div key={i} className="flex items-center justify-between bg-blue-500/10 rounded-lg p-3">
                                                                            <div>
                                                                                <p className="text-sm font-medium text-white">{m.projectgroup.projectgroupname}</p>
                                                                                {m.projectgroup.projecttitle && (
                                                                                    <p className="text-xs text-slate-500">{m.projectgroup.projecttitle}</p>
                                                                                )}
                                                                            </div>
                                                                            {m.isgroupleader && (
                                                                                <Badge className="bg-amber-500/15 text-amber-400 text-xs">
                                                                                    Group Leader
                                                                                </Badge>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {student.description && (
                                                            <div className="mt-3 bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Description</p>
                                                                <p className="text-sm text-slate-200">{student.description}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-center text-xs text-slate-400"
                >
                    Showing {filteredStudents.length} of {students.length} students
                </motion.div>
            </div>
        </div>
    );
}