// /components/admin/AdminProjectsContent.tsx
"use client";

import { useState, useMemo, useTransition } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { updateProjectGroupByAdmin } from "@/app/actions/adminActions";

type ProjectGroup = {
    projectgroupid: number;
    projectgroupname: string;
    projecttypeid: number;
    guidestaffname: string | null;
    projecttitle: string | null;
    projectarea: string | null;
    projectdescription: string | null;
    projectdeadline: Date | null;
    projectprogress: number;
    projectmarks: any;
    projectfeedback: string | null;
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
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const [editForm, setEditForm] = useState({
        projectDeadline: "",
        projectProgress: "0",
        projectMarks: "",
        projectFeedback: "",
    });

    // ── PDF Export ───────────────────────────────────────────────────────────
    function downloadProjectsPDF(projectList: ProjectGroup[]) {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        const now = new Date().toLocaleDateString("en-IN", {
            day: "2-digit", month: "long", year: "numeric",
        });

        /* ── helpers ── */
        const addPageBg = () => {
            doc.setFillColor(5, 10, 20);
            doc.rect(0, 0, pageW, pageH, "F");
        };

        const sectionTitle = (text: string, y: number) => {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 198, 255);
            doc.text(text, 14, y);
            doc.setDrawColor(0, 198, 255, 0.4);
            doc.setLineWidth(0.3);
            doc.line(14, y + 1.5, pageW - 14, y + 1.5);
        };

        /* ── Cover section ── */
        addPageBg();

        // Gradient header bar
        doc.setFillColor(0, 120, 200);
        doc.rect(0, 0, pageW, 42, "F");
        doc.setFillColor(0, 80, 160);
        doc.rect(0, 0, pageW / 2, 42, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("Project Groups Report", 14, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(180, 220, 255);
        doc.text("SPMS — Admin Portal", 14, 29);
        doc.text(`Generated: ${now}`, 14, 35.5);

        // Stats summary row
        const statBoxes = [
            { label: "Projects", val: String(stats.totalProjects) },
            { label: "Types", val: String(stats.totalProjectTypes) },
            { label: "Members", val: String(stats.totalMembers) },
            { label: "Meetings", val: String(stats.totalMeetings) },
        ];
        const boxW = (pageW - 28) / 4;
        statBoxes.forEach((b, i) => {
            const x = 14 + i * (boxW + 2);
            doc.setFillColor(10, 25, 55);
            doc.roundedRect(x, 48, boxW, 16, 2, 2, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(0, 198, 255);
            doc.text(b.val, x + boxW / 2, 57, { align: "center" });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(140, 170, 200);
            doc.text(b.label, x + boxW / 2, 61.5, { align: "center" });
        });

        let curY = 74;

        /* ── Summary table ── */
        sectionTitle(`All Projects (${projectList.length})`, curY);
        curY += 4;

        autoTable(doc, {
            startY: curY,
            head: [["#", "Group Name", "Project Title", "Type", "Guide", "Members"]],
            body: projectList.map((p, idx) => [
                idx + 1,
                p.projectgroupname,
                p.projecttitle || "—",
                p.projecttype.projecttypename,
                p.guidestaffname || "—",
                p.projectgroupmember.length,
            ]),
            styles: {
                font: "helvetica",
                fontSize: 8,
                textColor: [220, 235, 255],
                fillColor: [10, 20, 40],
                lineColor: [0, 80, 140],
                lineWidth: 0.2,
                cellPadding: 2.5,
            },
            headStyles: {
                fillColor: [0, 80, 160],
                textColor: [0, 198, 255],
                fontStyle: "bold",
                fontSize: 8.5,
            },
            alternateRowStyles: { fillColor: [8, 18, 38] },
            columnStyles: {
                0: { halign: "center", cellWidth: 8 },
                5: { halign: "center", cellWidth: 16 },
            },
            margin: { left: 14, right: 14 },
            tableLineColor: [0, 80, 140],
            tableLineWidth: 0.2,
        });

        /* ── Detailed section per project ── */
        projectList.forEach((p, idx) => {
            doc.addPage();
            addPageBg();

            // Project header strip
            doc.setFillColor(0, 60, 130);
            doc.rect(0, 0, pageW, 18, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(13);
            doc.setTextColor(255, 255, 255);
            doc.text(`${idx + 1}. ${p.projectgroupname}`, 14, 11);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(180, 210, 255);
            doc.text(p.projecttype.projecttypename, pageW - 14, 11, { align: "right" });

            let y = 24;

            // Info block
            sectionTitle("Project Info", y);
            y += 5;

            autoTable(doc, {
                startY: y,
                body: [
                    ["Project ID", p.projectgroupid, "Project Title", p.projecttitle || "—"],
                    ["Project Area", p.projectarea || "—", "Avg CPI", p.averagecpi ? Number(p.averagecpi).toFixed(2) : "—"],
                    ["Guide", p.guidestaffname || "—", "Created", new Date(p.created).toLocaleDateString("en-IN")],
                    ["Convener", p.staff_projectgroup_convenerstaffidTostaff?.staffname || "—", "Expert", p.staff_projectgroup_expertstaffidTostaff?.staffname || "—"],
                ],
                styles: {
                    font: "helvetica",
                    fontSize: 8,
                    textColor: [220, 235, 255],
                    fillColor: [10, 20, 40],
                    lineColor: [0, 80, 140],
                    lineWidth: 0.2,
                    cellPadding: 2.5,
                },
                columnStyles: {
                    0: { fontStyle: "bold", textColor: [0, 198, 255], cellWidth: 28 },
                    1: { cellWidth: 50 },
                    2: { fontStyle: "bold", textColor: [0, 198, 255], cellWidth: 28 },
                    3: { cellWidth: 50 },
                },
                margin: { left: 14, right: 14 },
                tableLineColor: [0, 80, 140],
                tableLineWidth: 0.2,
            });

            y = (doc as any).lastAutoTable.finalY + 6;

            // Description
            const desc = p.projectdescription || p.description;
            if (desc) {
                sectionTitle("Description", y);
                y += 5;
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(180, 210, 245);
                const lines = doc.splitTextToSize(desc, pageW - 28);
                doc.text(lines, 14, y);
                y += lines.length * 4.5 + 4;
            }

            // Members
            if (p.projectgroupmember.length > 0) {
                sectionTitle(`Group Members (${p.projectgroupmember.length})`, y);
                y += 4;

                autoTable(doc, {
                    startY: y,
                    head: [["#", "Student Name", "Email", "Role"]],
                    body: p.projectgroupmember.map((m, mi) => [
                        mi + 1,
                        m.student.studentname,
                        m.student.email || "—",
                        m.isgroupleader ? "Group Leader" : "Member",
                    ]),
                    styles: {
                        font: "helvetica",
                        fontSize: 8,
                        textColor: [220, 235, 255],
                        fillColor: [10, 20, 40],
                        lineColor: [0, 80, 140],
                        lineWidth: 0.2,
                        cellPadding: 2.5,
                    },
                    headStyles: {
                        fillColor: [0, 80, 160],
                        textColor: [0, 198, 255],
                        fontStyle: "bold",
                    },
                    alternateRowStyles: { fillColor: [8, 18, 38] },
                    columnStyles: {
                        0: { halign: "center", cellWidth: 8 },
                        3: { halign: "center", cellWidth: 24 },
                    },
                    margin: { left: 14, right: 14 },
                    bodyStyles: {
                        didParseCell: (data: any) => {
                            if (data.column.index === 3 && data.cell.raw === "Group Leader") {
                                data.cell.styles.textColor = [251, 191, 36];
                                data.cell.styles.fontStyle = "bold";
                            }
                        },
                    } as any,
                    tableLineColor: [0, 80, 140],
                    tableLineWidth: 0.2,
                });
            }

            // Page footer
            const pgNum = doc.getNumberOfPages();
            doc.setFontSize(7);
            doc.setTextColor(80, 110, 150);
            doc.text(`Page ${pgNum} • SPMS Project Report • ${now}`, pageW / 2, pageH - 6, { align: "center" });
        });

        doc.save(`SPMS_Projects_${new Date().toISOString().slice(0, 10)}.pdf`);
    }

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
                        <Button
                            variant="outline"
                            className="border-blue-500/20 text-cyan-400 hover:bg-blue-500/10 hover:text-white hover:border-cyan-400/50 transition-all"
                            onClick={() => downloadProjectsPDF(filteredProjects)}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
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

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Deadline</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {project.projectdeadline
                                                                        ? new Date(project.projectdeadline).toLocaleDateString("en-US", {
                                                                            year: "numeric", month: "short", day: "numeric"
                                                                        })
                                                                        : "Not set"}
                                                                </p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Progress</p>
                                                                <p className="text-sm text-slate-200">{project.projectprogress ?? 0}%</p>
                                                            </div>
                                                            <div className="bg-white/5 rounded-lg p-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Marks</p>
                                                                <p className="text-sm text-slate-200">
                                                                    {project.projectmarks !== null && project.projectmarks !== undefined
                                                                        ? Number(project.projectmarks).toFixed(2)
                                                                        : "Pending"}
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

                                                        <div className="mt-3 bg-white/5 rounded-lg p-3">
                                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                                <p className="text-[10px] font-medium text-slate-400 uppercase">Feedback</p>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="border-blue-500/20 text-cyan-400 hover:bg-blue-500/10"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditingProjectId(project.projectgroupid);
                                                                        setEditForm({
                                                                            projectDeadline: project.projectdeadline
                                                                                ? new Date(project.projectdeadline).toISOString().slice(0, 10)
                                                                                : "",
                                                                            projectProgress: String(project.projectprogress ?? 0),
                                                                            projectMarks:
                                                                                project.projectmarks !== null && project.projectmarks !== undefined
                                                                                    ? String(project.projectmarks)
                                                                                    : "",
                                                                            projectFeedback: project.projectfeedback || "",
                                                                        });
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </div>
                                                            <p className="text-sm text-slate-200">
                                                                {project.projectfeedback || "No feedback added yet."}
                                                            </p>
                                                        </div>

                                                        {editingProjectId === project.projectgroupid && (
                                                            <div className="mt-3 rounded-lg border border-blue-500/20 bg-[#08111f] p-4 space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Deadline</Label>
                                                                        <Input
                                                                            type="date"
                                                                            value={editForm.projectDeadline}
                                                                            onChange={(e) => setEditForm((prev) => ({ ...prev, projectDeadline: e.target.value }))}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Progress (%)</Label>
                                                                        <Input
                                                                            type="number"
                                                                            min="0"
                                                                            max="100"
                                                                            value={editForm.projectProgress}
                                                                            onChange={(e) => setEditForm((prev) => ({ ...prev, projectProgress: e.target.value }))}
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label>Marks</Label>
                                                                        <Input
                                                                            type="number"
                                                                            min="0"
                                                                            step="0.01"
                                                                            value={editForm.projectMarks}
                                                                            onChange={(e) => setEditForm((prev) => ({ ...prev, projectMarks: e.target.value }))}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Feedback</Label>
                                                                    <Textarea
                                                                        rows={4}
                                                                        value={editForm.projectFeedback}
                                                                        onChange={(e) => setEditForm((prev) => ({ ...prev, projectFeedback: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        onClick={() => setEditingProjectId(null)}
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                        disabled={isPending}
                                                                        onClick={() => {
                                                                            startTransition(async () => {
                                                                                await updateProjectGroupByAdmin({
                                                                                    groupId: project.projectgroupid,
                                                                                    projectDeadline: editForm.projectDeadline ? new Date(editForm.projectDeadline) : null,
                                                                                    projectProgress: Number(editForm.projectProgress || 0),
                                                                                    projectMarks: editForm.projectMarks ? Number(editForm.projectMarks) : null,
                                                                                    projectFeedback: editForm.projectFeedback || null,
                                                                                });
                                                                                window.location.reload();
                                                                            });
                                                                        }}
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </div>
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
