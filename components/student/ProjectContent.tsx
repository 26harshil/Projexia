
'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban,
  Search,
  LayoutGrid,
  List,
  Users,
  MapPin,
  Calendar,
  Award,
  Mail,
  Sparkles,
  BookOpen,
  ChevronRight,
  X,
  Phone,
  Clock,
  TrendingUp,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Member {
  memberId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  isLeader: boolean;
  joinedAt: string;
}

interface ProjectContentProps {
  projectGroups: any[];
  error: string | null;
}

// ─── mock data so the page renders standalone ─────────────────────────────
const MOCK_GROUPS = [
  {
    isGroupLeader: true,
    projectGroup: {
      groupId: 1,
      groupName: "Alpha Team",
      projectTitle: "AI-Powered Campus Navigation",
      projectArea: "Artificial Intelligence",
      projectDescription:
        "Building an intelligent navigation system for campus using computer vision and real-time pathfinding algorithms to help new students find their way around.",
      averageCPI: "8.42",
      projectStatus: "Active",
      projectType: "Research",
      guideFaculty: "Dr. Priya Sharma",
      guideFacultyEmail: "priya.sharma@university.edu",
      createdAt: "2024-07-15T00:00:00Z",
      members: [
        { memberId: 1, studentId: 101, studentName: "Arjun Mehta", studentEmail: "arjun.m@uni.edu", studentPhone: "+91 98765 43210", isLeader: true, joinedAt: "2024-07-15" },
        { memberId: 2, studentId: 102, studentName: "Sneha Patel", studentEmail: "sneha.p@uni.edu", studentPhone: "+91 91234 56789", isLeader: false, joinedAt: "2024-07-16" },
        { memberId: 3, studentId: 103, studentName: "Rahul Verma", studentEmail: "rahul.v@uni.edu", isLeader: false, joinedAt: "2024-07-17" },
        { memberId: 4, studentId: 104, studentName: "Kavya Nair", studentEmail: "kavya.n@uni.edu", studentPhone: "+91 99887 76655", isLeader: false, joinedAt: "2024-07-18" },
      ],
    },
  },
  {
    isGroupLeader: false,
    projectGroup: {
      groupId: 2,
      groupName: "Beta Squad",
      projectTitle: "Smart Energy Monitor",
      projectArea: "IoT & Embedded Systems",
      projectDescription:
        "Developing a low-cost IoT device to monitor and optimize energy consumption across university buildings using ESP32 microcontrollers and a real-time dashboard.",
      averageCPI: "7.85",
      projectStatus: "On Hold",
      projectType: "Development",
      guideFaculty: "Prof. Amit Joshi",
      guideFacultyEmail: "amit.joshi@university.edu",
      createdAt: "2024-08-01T00:00:00Z",
      members: [
        { memberId: 5, studentId: 105, studentName: "Divya Singh", studentEmail: "divya.s@uni.edu", isLeader: true, joinedAt: "2024-08-01" },
        { memberId: 6, studentId: 106, studentName: "Yash Kothari", studentEmail: "yash.k@uni.edu", studentPhone: "+91 88776 65544", isLeader: false, joinedAt: "2024-08-02" },
        { memberId: 7, studentId: 107, studentName: "Pooja Rana", studentEmail: "pooja.r@uni.edu", isLeader: false, joinedAt: "2024-08-03" },
      ],
    },
  },
  {
    isGroupLeader: false,
    projectGroup: {
      groupId: 3,
      groupName: "Gamma Crew",
      projectTitle: "Blockchain Credential System",
      projectArea: "Blockchain",
      projectDescription:
        "Creating a tamper-proof academic credential issuance and verification system using Ethereum smart contracts and IPFS decentralised storage.",
      averageCPI: "9.01",
      projectStatus: "Completed",
      projectType: "Research",
      guideFaculty: "Dr. Neha Gupta",
      guideFacultyEmail: "neha.gupta@university.edu",
      createdAt: "2024-03-10T00:00:00Z",
      members: [
        { memberId: 8, studentId: 108, studentName: "Rohan Das", studentEmail: "rohan.d@uni.edu", studentPhone: "+91 77665 54433", isLeader: true, joinedAt: "2024-03-10" },
        { memberId: 9, studentId: 109, studentName: "Meera Iyer", studentEmail: "meera.i@uni.edu", isLeader: false, joinedAt: "2024-03-11" },
      ],
    },
  },
];

export default function ProjectContent({ projectGroups: propGroups, error }: ProjectContentProps) {
  const projectGroups = propGroups?.length ? propGroups : MOCK_GROUPS;
  const [selected, setSelected] = useState<any | null>(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = projectGroups.filter((g: any) =>
    g.projectGroup.projectTitle.toLowerCase().includes(query.toLowerCase()) ||
    g.projectGroup.projectArea?.toLowerCase().includes(query.toLowerCase())
  );

  const getStatusColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case "active": return "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30";
      case "completed": return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "on hold": return "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30";
      default: return "bg-white/5 text-slate-400 border border-white/10";
    }
  };

  const getStatusDot = (s: string) => {
    switch (s?.toLowerCase()) {
      case "active": return "bg-cyan-400";
      case "completed": return "bg-blue-400";
      case "on hold": return "bg-yellow-400";
      default: return "bg-slate-400";
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const avatarColors = [
    "from-blue-500/40 to-cyan-500/40 text-blue-200",
    "from-indigo-500/40 to-blue-500/40 text-indigo-200",
    "from-cyan-500/40 to-teal-500/40 text-cyan-200",
    "from-violet-500/40 to-indigo-500/40 text-violet-200",
  ];

  return (
    <div className="min-h-screen bg-[#050A14]">
      {/* BG layers */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-[#050A14] to-[#050A14] pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%233B9EFF%22%20stroke-opacity%3D%220.04%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-80 pointer-events-none" />

      {/* Page header */}
      <div className="relative overflow-hidden border-b border-blue-500/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-full blur-3xl opacity-[0.08] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="mb-3">
            <Badge className="bg-blue-500/15 text-blue-300 border border-blue-500/25 hover:bg-blue-500/20">
              <Sparkles className="h-3 w-3 mr-1.5" /> Project Dashboard
            </Badge>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-sm text-slate-400 mb-1">Welcome back,</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              My{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Projects</span>{" "}
              👋
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-slate-400 max-w-md mt-2 text-sm">
            Track progress, manage team members, and stay on top of deliverables.
          </motion.p>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search by title or area…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-white/5 border-blue-500/20 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 backdrop-blur-sm rounded-xl"
            />
          </div>
          <div className="flex gap-2">
            {(["grid", "list"] as const).map((v) => (
              <Button key={v} onClick={() => setView(v)} variant="outline" size="icon"
                className={`rounded-xl border-blue-500/20 backdrop-blur-sm transition-all ${view === v ? "bg-blue-500/20 text-blue-300 border-blue-400/40" : "bg-white/5 text-slate-400 hover:bg-blue-500/10 hover:text-white"}`}>
                {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 rounded-2xl border border-red-500/20 p-6 text-center mb-8">
            <p className="text-red-400">{error}</p>
          </motion.div>
        )}

        {/* Empty */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-14 text-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }} className="inline-block mb-6">
              <div className="p-8 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <FolderKanban className="h-16 w-16 text-blue-400 mx-auto" />
              </div>
            </motion.div>
            <h3 className="text-lg font-semibold text-white mb-2">No Projects Found</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">Try a different search or wait for project assignments from your faculty.</p>
          </motion.div>
        )}

        {/* Grid */}
        {view === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((group: any, i: number) => (
              <ProjectCard key={group.projectGroup.groupId} group={group} index={i}
                onView={() => setSelected(group)} getStatusColor={getStatusColor}
                getStatusDot={getStatusDot} getInitials={getInitials} avatarColors={avatarColors} />
            ))}
          </div>
        )}

        {/* List */}
        {view === "list" && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((group: any, i: number) => (
              <ProjectRow key={group.projectGroup.groupId} group={group} index={i}
                onView={() => setSelected(group)} getStatusColor={getStatusColor} getStatusDot={getStatusDot} />
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} className="fixed inset-0 z-40 bg-[#050A14]/75 backdrop-blur-sm" />

            <motion.div key="panel" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-[#080E1E] border-l border-blue-500/20 overflow-y-auto shadow-2xl shadow-black/60">
              <DetailPanel group={selected} onClose={() => setSelected(null)}
                getStatusColor={getStatusColor} getStatusDot={getStatusDot}
                getInitials={getInitials} avatarColors={avatarColors} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── PROJECT CARD ──────────────────────────────────────────────────────────── */
function ProjectCard({ group, index, onView, getStatusColor, getStatusDot, getInitials, avatarColors }: any) {
  const pg = group.projectGroup;
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      className="group relative bg-white/[0.04] backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 md:p-8 flex flex-col gap-6 hover:border-blue-400/40 hover:bg-white/[0.07] transition-all duration-300">
      {/* top accent */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-full" />

      {/* header */}
      <div className="flex items-start justify-between gap-3">
        <div className="p-3.5 bg-blue-500/15 border border-blue-500/20 rounded-2xl shrink-0">
          <FolderKanban className="h-7 w-7 text-blue-400" />
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {group.isGroupLeader && (
            <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Award className="h-3.5 w-3.5" /> Leader
            </span>
          )}
          <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm ${getStatusColor(pg.projectStatus)}`}>
            <span className={`w-2 h-2 rounded-full ${getStatusDot(pg.projectStatus)}`} />
            {pg.projectStatus}
          </span>
        </div>
      </div>

      {/* title + desc */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2.5 leading-snug group-hover:text-blue-100 transition-colors">
          {pg.projectTitle}
        </h3>
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{pg.projectDescription}</p>
      </div>

      {/* meta chips */}
      <div className="flex flex-wrap gap-2">
        {pg.projectArea && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-blue-500/10 px-3 py-1.5 rounded-xl">
            <MapPin className="h-3.5 w-3.5 text-blue-400" />{pg.projectArea}
          </span>
        )}
        {pg.projectType && (
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-blue-500/10 px-3 py-1.5 rounded-xl">
            <BookOpen className="h-3.5 w-3.5 text-cyan-400" />{pg.projectType}
          </span>
        )}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between pt-5 border-t border-blue-500/10">
        {/* avatar stack */}
        <div className="flex -space-x-3">
          {pg.members.slice(0, 4).map((m: any, i: number) => (
            <div key={m.memberId} className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} border-2 border-[#080E1E] flex items-center justify-center text-xs shadow-md font-bold z-10 hover:z-20 transition-all`}>
              {getInitials(m.studentName)}
            </div>
          ))}
          {pg.members.length > 4 && (
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#080E1E] flex items-center justify-center text-[11px] text-slate-300 font-bold z-10 shadow-md">
              +{pg.members.length - 4}
            </div>
          )}
        </div>
        {/* CTA */}
        <button onClick={onView}
          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-cyan-300 font-bold transition-colors group/btn bg-blue-500/10 hover:bg-blue-500/20 px-4 py-2 rounded-xl">
          Details
          <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

/* ── PROJECT ROW ───────────────────────────────────────────────────────────── */
function ProjectRow({ group, index, onView, getStatusColor, getStatusDot }: any) {
  const pg = group.projectGroup;
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      onClick={onView}
      className="flex items-center gap-5 bg-white/[0.04] backdrop-blur-sm border border-blue-500/20 rounded-2xl px-6 py-5 hover:border-blue-400/40 hover:bg-white/[0.07] hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="p-3 bg-blue-500/15 border border-blue-500/20 rounded-xl shrink-0 shadow-sm">
        <FolderKanban className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
      </div>
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-lg font-bold text-white truncate group-hover:text-blue-100 transition-colors mb-0.5">{pg.projectTitle}</p>
        <p className="text-sm text-slate-400 truncate font-medium">{pg.projectArea} <span className="text-slate-600 mx-1">•</span> {pg.projectType}</p>
      </div>
      <span className={`text-xs shadow-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 ${getStatusColor(pg.projectStatus)}`}>
        <span className={`w-2 h-2 rounded-full ${getStatusDot(pg.projectStatus)}`} />
        {pg.projectStatus}
      </span>
      <div className="flex items-center gap-2 text-slate-400 shrink-0 ml-4 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
        <Users className="h-4 w-4" />
        <span className="text-sm font-bold">{pg.members.length}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
    </motion.div>
  );
}

/* ── DETAIL PANEL ──────────────────────────────────────────────────────────── */
function DetailPanel({ group, onClose, getStatusColor, getStatusDot, getInitials, avatarColors }: any) {
  const pg = group.projectGroup;

  const infoItems = [
    { icon: MapPin, label: "Area", value: pg.projectArea, color: "text-blue-400" },
    { icon: BookOpen, label: "Type", value: pg.projectType, color: "text-cyan-400" },
    { icon: TrendingUp, label: "Avg CPI", value: pg.averageCPI, color: "text-blue-300" },
    { icon: Calendar, label: "Created", value: pg.createdAt ? new Date(pg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null, color: "text-cyan-300" },
  ].filter((i) => i.value);

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="relative overflow-hidden px-6 pt-6 pb-5 border-b border-blue-500/15 shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/15 border border-blue-500/25 rounded-xl">
              <FolderKanban className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${getStatusColor(pg.projectStatus)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(pg.projectStatus)}`} />
                  {pg.projectStatus}
                </span>
                {group.isGroupLeader && (
                  <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Award className="h-2.5 w-2.5" /> Leader
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{pg.groupName}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-xl font-bold text-white mt-4 leading-snug relative">{pg.projectTitle}</h2>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Description */}
        {pg.projectDescription && (
          <section>
            <SectionLabel>About</SectionLabel>
            <p className="text-sm text-slate-400 leading-relaxed bg-white/[0.03] border border-blue-500/10 rounded-xl p-4">
              {pg.projectDescription}
            </p>
          </section>
        )}

        {/* Info grid */}
        {infoItems.length > 0 && (
          <section>
            <SectionLabel>Details</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              {infoItems.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-white/[0.03] border border-blue-500/10 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg mt-0.5 shrink-0">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-xs font-semibold text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Guide faculty */}
        {pg.guideFaculty && (
          <section>
            <SectionLabel>Guide Faculty</SectionLabel>
            <div className="flex items-center gap-4 bg-white/[0.03] border border-blue-500/15 rounded-xl p-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-500/25 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-blue-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{pg.guideFaculty}</p>
                {pg.guideFacultyEmail && (
                  <a href={`mailto:${pg.guideFacultyEmail}`}
                    className="text-xs text-blue-400 hover:text-cyan-300 flex items-center gap-1 mt-0.5 transition-colors truncate">
                    <Mail className="h-3 w-3 shrink-0" />{pg.guideFacultyEmail}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Team members */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel className="mb-0">Team Members</SectionLabel>
            <span className="text-xs bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 px-2.5 py-0.5 rounded-full font-semibold">
              {pg.members.length}
            </span>
          </div>
          <div className="space-y-2">
            {pg.members.map((member: any, i: number) => (
              <motion.div key={member.memberId} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-blue-500/10 rounded-xl hover:bg-white/[0.06] hover:border-blue-400/25 transition-all">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} border border-blue-500/20 flex items-center justify-center text-xs font-bold shrink-0`}>
                  {getInitials(member.studentName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-white truncate">{member.studentName}</p>
                    {member.isLeader && (
                      <span className="text-[9px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded shrink-0">LEAD</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{member.studentEmail}</p>
                </div>
                <div className="text-right shrink-0">
                  {member.studentPhone && (
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                      <Phone className="h-2.5 w-2.5" />{member.studentPhone}
                    </p>
                  )}
                  <p className="text-[10px] text-slate-600 flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="h-2.5 w-2.5" />
                    {new Date(member.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Panel footer */}
      <div className="shrink-0 px-6 py-4 border-t border-blue-500/15 bg-[#080E1E]">
        <Button onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 rounded-xl shadow-lg shadow-blue-500/20">
          Close Details
        </Button>
      </div>
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-3 ${className}`}>
      {children}
    </p>
  );
}