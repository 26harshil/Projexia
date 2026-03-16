// /components/admin/AdminProjectsContent.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FolderKanban,
    Search,
    Download,
    Users,
    Clock,
    BookOpen,
    ChevronDown,
    ChevronUp,
    Calendar,
    User,
    MapPin,
    FileText,
    X,
    Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ProjectGroup = {
    projectgroupid: number;
    projectgroupname: string;
    projecttypeid: number;
    guidestaffname: string | null;
    projecttitle: string | null;
    projectarea: string | null;
    projectdescription: string | null;
    averagecpi: any;
    convenerstaffid: number | null;
    expertstaffid: number | null;
    description: string | null;
    created: Date;
    modified: Date | null;
    projecttype: {
        projecttypename: string;
    };
    projectgroupmember: {
        isgroupleader: boolean;
        student: {
            studentname: string;
            email: string | null;
        };
    }[];
    staff_projectgroup_convenerstaffidTostaff: {
        staffname: string;
    } | null;
    staff_projectgroup_expertstaffidTostaff: {
        staffname: string;
    } | null;
};

type Stats = {
    totalProjects: number;
    totalProjectTypes: number;
    totalMembers: number;
    totalMeetings: number;
};

interface AdminProjectsContentProps {
    initialProjects: ProjectGroup[];
    initialStats: Stats;
}

export function AdminProjectsContent({ initialProjects, initialStats }: AdminProjectsContentProps) {
    const [projects] = useState<ProjectGroup[]>(initialProjects);
    const [stats] = useState<Stats>(initialStats);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedProjectId, setExpandedProjectId] = useState<number | null>(null);

    const filteredProjects = useMemo(() => {
        if (!searchQuery) return projects;
        const query = searchQuery.toLowerCase();
        return projects.filter((p) =>
            p.projectgroupname.toLowerCase().includes(query) ||
            (p.projecttitle && p.projecttitle.toLowerCase().includes(query)) ||
            (p.projectarea && p.projectarea.toLowerCase().includes(query)) ||
            (p.guidestaffname && p.guidestaffname.toLowerCase().includes(query)) ||
            p.projecttype.projecttypename.toLowerCase().includes(query)
        );
    }, [projects, searchQuery]);

    const statCards = [
        { label: "Total Projects", value: stats.totalProjects, icon: FolderKanban, color: "blue" },
        { label: "Project Types", value: stats.totalProjectTypes, icon: BookOpen, color: "violet" },
        { label: "Group Members", value: stats.totalMembers, icon: Users, color: "emerald" },
        { label: "Total Meetings", value: stats.totalMeetings, icon: Clock, color: "amber" },
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
                            Projects
                        </h1>
                        <p className="text-slate-500">
                            Manage all project groups and assignments
                            <span className="ml-2 text-sm text-slate-400">({filteredProjects.length} showing)</span>
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
                                    stat.color === "blue" && "bg-blue-500/15",
                                    stat.color === "violet" && "bg-violet-100",
                                    stat.color === "emerald" && "bg-blue-500/15",
                                    stat.color === "amber" && "bg-amber-500/15",
                                )}>
                                    <stat.icon className={cn(
                                        "h-5 w-5",
                                        stat.color === "blue" && "text-blue-400",
                                        stat.color === "violet" && "text-violet-600",
                                        stat.color === "emerald" && "text-cyan-400",
                                        stat.color === "amber" && "text-amber-400",
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

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 p-4 mb-6"
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search projects by name, title, area, type, or guide..."
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
                </motion.div>

                {/* Projects List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.length === 0 ? (
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
                                        <div className="absolute inset-0 bg-blue-200 rounded-2xl blur-xl opacity-40" />
                                        <div className="relative bg-blue-500/10 border border-blue-500/20 p-8 rounded-2xl">
                                            <FolderKanban className="h-16 w-16 text-blue-400 mx-auto" />
                                        </div>
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
                                <p className="text-slate-500 mb-6 max-w-md mx-auto">
                                    {searchQuery
                                        ? "No projects match your search criteria."
                                        : "There are no project groups created in the system yet."}
                                </p>
                                {searchQuery && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchQuery("")}
                                        className="border-blue-500/25 text-blue-400 hover:bg-blue-500/10"
                                    >
                                        Clear Search
                                    </Button>
                                )}
                            </motion.div>
                        ) : (
                            filteredProjects.map((project, index) => {
                                const isExpanded = expandedProjectId === project.projectgroupid;
                                const memberCount = project.projectgroupmember.length;
                                const leader = project.projectgroupmember.find(m => m.isgroupleader);

                                return (
                                    <motion.div
                                        key={project.projectgroupid}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="bg-white/5 backdrop-blur-md rounded-xl border border-blue-500/20 overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div
                                            className="p-4 md:p-5 cursor-pointer"
                                            onClick={() => setExpandedProjectId(isExpanded ? null : project.projectgroupid)}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                                        <FolderKanban className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="font-semibold text-white">{project.projectgroupname}</p>
                                                            <Badge className="bg-blue-500/15 text-blue-700 text-[10px]">
                                                                {project.projecttype.projecttypename}
                                                            </Badge>
                                                        </div>
                                                        {project.projecttitle && (
                                                            <p className="text-sm text-slate-300 mt-0.5">{project.projecttitle}</p>
                                                        )}
                                                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                                                            {project.guidestaffname && (
                                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                    <User className="h-3 w-3 text-slate-400" />
                                                                    Guide: {project.guidestaffname}
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Users className="h-3 w-3 text-slate-400" />
                                                                {memberCount} member{memberCount !== 1 ? "s" : ""}
                                                            </div>
                                                            {project.projectarea && (
                                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                    <MapPin className="h-3 w-3 text-slate-400" />
                                                                    {project.projectarea}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {leader && (
                                                        <Badge className="bg-amber-500/10 text-amber-400 text-[10px] hidden sm:flex">
                                                            <Crown className="h-2.5 w-2.5 mr-1" />
                                                            {leader.student.studentname}
                                                        </Badge>
                                                    )}
                                                    {isExpanded ? (
                                                        <ChevronUp className="h-4 w-4 text-slate-400" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                                    )}
                                                </div>
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
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Project ID</p>
                                                                <p className="text-sm font-mono text-slate-200">{project.projectgroupid}</p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Created</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {new Date(project.created).toLocaleDateString("en-US", {
                                                                        year: "numeric", month: "short", day: "numeric"
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Avg CPI</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {project.averagecpi ? Number(project.averagecpi).toFixed(2) : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Staff info */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                            {project.staff_projectgroup_convenerstaffidTostaff && (
                                                                <div className="bg-blue-500/10 rounded-lg p-3">
                                                                    <p className="text-[10px] font-medium text-cyan-400 uppercase mb-1">Convener</p>
                                                                    <p className="text-sm font-medium text-slate-200">
                                                                        {project.staff_projectgroup_convenerstaffidTostaff.staffname}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {project.staff_projectgroup_expertstaffidTostaff && (
                                                                <div className="bg-blue-500/10 rounded-lg p-3">
                                                                    <p className="text-[10px] font-medium text-blue-500 uppercase mb-1">Expert</p>
                                                                    <p className="text-sm font-medium text-slate-200">
                                                                        {project.staff_projectgroup_expertstaffidTostaff.staffname}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Members */}
                                                        {project.projectgroupmember.length > 0 && (
                                                            <div className="mt-4">
                                                                <p className="text-xs font-semibold text-slate-300 mb-2">
                                                                    Group Members ({project.projectgroupmember.length})
                                                                </p>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    {project.projectgroupmember.map((m, i) => (
                                                                        <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">
                                                                                    {m.student.studentname.charAt(0)}
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-sm font-medium text-white">{m.student.studentname}</p>
                                                                                    {m.student.email && (
                                                                                        <p className="text-[10px] text-slate-400">{m.student.email}</p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            {m.isgroupleader && (
                                                                                <Badge className="bg-amber-500/15 text-amber-400 text-[10px]">Leader</Badge>
                                                                            )}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Description */}
                                                        {(project.projectdescription || project.description) && (
                                                            <div className="mt-3 bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Description</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {project.projectdescription || project.description}
                                                                </p>
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
                    Showing {filteredProjects.length} of {projects.length} projects
                </motion.div>
            </div>
        </div>
    );
}