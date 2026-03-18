'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  Phone,
  Award,
  MapPin,
  Calendar,
  Crown,
  Sparkles,
  FolderKanban,
  BookOpen,
  X,
  GraduationCap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Member {
  memberId: number;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  isLeader: boolean;
  cgpa?: string;
  joinedAt: string;
}

interface GroupProps {
  projectGroups: any[];
  error: string | null;
}

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
      expertFaculty: "Prof. R. Menon",
      createdAt: "2024-07-15T00:00:00Z",
      members: [
        { memberId: 1, studentId: 101, studentName: "Arjun Mehta", studentEmail: "arjun.m@uni.edu", studentPhone: "+91 98765 43210", isLeader: true, cgpa: "9.1", joinedAt: "2024-07-15" },
        { memberId: 2, studentId: 102, studentName: "Sneha Patel", studentEmail: "sneha.p@uni.edu", studentPhone: "+91 91234 56789", isLeader: false, cgpa: "8.7", joinedAt: "2024-07-16" },
        { memberId: 3, studentId: 103, studentName: "Rahul Verma", studentEmail: "rahul.v@uni.edu", isLeader: false, cgpa: "8.2", joinedAt: "2024-07-17" },
        { memberId: 4, studentId: 104, studentName: "Kavya Nair", studentEmail: "kavya.n@uni.edu", studentPhone: "+91 99887 76655", isLeader: false, cgpa: "8.5", joinedAt: "2024-07-18" },
      ],
    },
  },
  {
    isGroupLeader: true,
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
        { memberId: 5, studentId: 105, studentName: "Divya Singh", studentEmail: "divya.s@uni.edu", isLeader: true, cgpa: "8.0", joinedAt: "2024-08-01" },
        { memberId: 6, studentId: 106, studentName: "Yash Kothari", studentEmail: "yash.k@uni.edu", studentPhone: "+91 88776 65544", isLeader: false, cgpa: "7.9", joinedAt: "2024-08-02" },
        { memberId: 7, studentId: 107, studentName: "Pooja Rana", studentEmail: "pooja.r@uni.edu", isLeader: false, cgpa: "7.6", joinedAt: "2024-08-03" },
      ],
    },
  },
];

export default function GroupContent({ projectGroups: propGroups, error }: GroupProps) {
  const projectGroups = propGroups?.length ? propGroups : MOCK_GROUPS;
  const leaderGroups = projectGroups.filter((g: any) => g.isGroupLeader);
  const [selected, setSelected] = useState<any | null>(null);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

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
              <Sparkles className="h-3 w-3 mr-1.5" /> Group Dashboard
            </Badge>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="text-sm text-slate-400 mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              My{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Groups</span>{" "}
              👋
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-slate-400 max-w-md mt-2">
            Manage and lead your project teams effectively.
          </motion.p>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-10">

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-500/10 rounded-2xl border border-red-500/20 p-6 text-center mb-8">
            <p className="text-red-400 text-base">{error}</p>
          </motion.div>
        )}

        {/* Empty state */}
        {leaderGroups.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-blue-500/20 p-16 text-center">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="inline-block mb-6">
              <div className="p-8 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <Users className="h-20 w-20 text-blue-400 mx-auto" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">No Groups to Lead</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              You are not the leader of any project groups yet. Once assigned, you can manage your team here.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-7">
            {leaderGroups.map((group: any, index: number) => (
              <GroupCard
                key={group.projectGroup.groupId}
                group={group}
                index={index}
                onView={() => setSelected(group)}
                getInitials={getInitials}
                getStatusColor={getStatusColor}
                getStatusDot={getStatusDot}
                avatarColors={avatarColors}
              />
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
                getInitials={getInitials} getStatusColor={getStatusColor}
                getStatusDot={getStatusDot} avatarColors={avatarColors} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── GROUP CARD ────────────────────────────────────────────────────────────── */
function GroupCard({ group, index, onView, getInitials, getStatusColor, getStatusDot, avatarColors }: any) {
  const pg = group.projectGroup;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group relative bg-white/[0.04] backdrop-blur-sm border border-blue-500/20 rounded-2xl p-7 hover:border-blue-400/40 hover:bg-white/[0.07] transition-all duration-300"
    >
      {/* top accent line */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent rounded-full" />

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/15 border border-blue-500/25 rounded-xl shrink-0">
            <Users className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold text-white group-hover:text-blue-100 transition-colors">
                {pg.groupName}
              </h2>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${getStatusColor(pg.projectStatus)}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(pg.projectStatus)}`} />
                {pg.projectStatus}
              </span>
              <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Crown className="h-3 w-3" /> Group Leader
              </span>
            </div>
            <p className="text-base text-slate-400">{pg.projectTitle}</p>
          </div>
        </div>

        {/* View Details CTA */}
        <button onClick={onView}
          className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-cyan-300 font-semibold transition-colors group/btn shrink-0 mt-1">
          View Details
          <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* ── META CHIPS ── */}
      <div className="flex flex-wrap gap-2 mb-7">
        {pg.projectArea && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-blue-500/10 px-3 py-1.5 rounded-lg">
            <MapPin className="h-3 w-3 text-blue-400" />{pg.projectArea}
          </span>
        )}
        {pg.projectType && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-blue-500/10 px-3 py-1.5 rounded-lg">
            <BookOpen className="h-3 w-3 text-cyan-400" />{pg.projectType}
          </span>
        )}
        {pg.averageCPI && (
          <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-blue-500/10 px-3 py-1.5 rounded-lg">
            <TrendingUp className="h-3 w-3 text-blue-300" />Avg CPI: {pg.averageCPI}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-blue-500/10 px-3 py-1.5 rounded-lg">
          <Calendar className="h-3 w-3 text-cyan-300" />
          Formed {new Date(pg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      </div>

      {/* ── GUIDE FACULTY ── */}
      {pg.guideFaculty && (
        <div className="mb-7 pb-7 border-b border-blue-500/10">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Guide Faculty</p>
          <div className="flex items-center gap-4 bg-white/[0.03] border border-blue-500/10 rounded-xl p-4 w-fit">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-500/25 flex items-center justify-center shrink-0">
              <GraduationCap className="h-6 w-6 text-blue-300" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">{pg.guideFaculty}</p>
              {pg.guideFacultyEmail && (
                <a href={`mailto:${pg.guideFacultyEmail}`}
                  className="text-sm text-blue-400 hover:text-cyan-300 flex items-center gap-1 mt-0.5 transition-colors">
                  <Mail className="h-3.5 w-3.5 shrink-0" />{pg.guideFacultyEmail}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TEAM MEMBERS ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-cyan-400" /> Team Members
          </p>
          <span className="text-xs bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 px-2.5 py-0.5 rounded-full font-semibold">
            {pg.members.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pg.members.map((member: any, i: number) => (
            <motion.div key={member.memberId}
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 bg-white/[0.03] border border-blue-500/10 rounded-xl hover:bg-white/[0.06] hover:border-blue-400/25 transition-all">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} border border-blue-500/20 flex items-center justify-center text-sm font-bold shrink-0`}>
                  {getInitials(member.studentName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-white truncate">{member.studentName}</p>
                    {member.isLeader && (
                      <span className="text-[9px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                        <Crown className="h-2 w-2" />LEAD
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{member.studentEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3 shrink-0">
                {member.studentPhone && (
                  <a href={`tel:${member.studentPhone}`}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-blue-500/20 text-slate-500 hover:text-blue-400 border border-white/10 hover:border-blue-500/30 transition-all">
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                )}
                <a href={`mailto:${member.studentEmail}`}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-500 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/30 transition-all">
                  <Mail className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── DETAIL PANEL ──────────────────────────────────────────────────────────── */
function DetailPanel({ group, onClose, getInitials, getStatusColor, getStatusDot, avatarColors }: any) {
  const pg = group.projectGroup;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="relative overflow-hidden px-6 pt-6 pb-5 border-b border-blue-500/15 shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/15 border border-blue-500/25 rounded-xl">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${getStatusColor(pg.projectStatus)}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(pg.projectStatus)}`} />
                  {pg.projectStatus}
                </span>
                <span className="text-xs font-semibold text-yellow-400 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="h-2.5 w-2.5" /> Leader
                </span>
              </div>
              <p className="text-xs text-slate-500">{pg.projectTitle}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-all shrink-0">
            <X className="h-4 w-4" />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-white mt-4 leading-snug relative">{pg.groupName}</h2>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

        {/* Description */}
        {pg.projectDescription && (
          <section>
            <SectionLabel>About the Project</SectionLabel>
            <p className="text-sm text-slate-400 leading-relaxed bg-white/[0.03] border border-blue-500/10 rounded-xl p-4">
              {pg.projectDescription}
            </p>
          </section>
        )}

        {/* Details grid */}
        <section>
          <SectionLabel>Details</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: MapPin, label: "Area", value: pg.projectArea, color: "text-blue-400" },
              { icon: BookOpen, label: "Type", value: pg.projectType, color: "text-cyan-400" },
              { icon: TrendingUp, label: "Avg CPI", value: pg.averageCPI, color: "text-blue-300" },
              { icon: Calendar, label: "Formed", value: pg.createdAt ? new Date(pg.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null, color: "text-cyan-300" },
            ].filter(i => i.value).map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white/[0.03] border border-blue-500/10 rounded-xl p-3.5 flex items-start gap-3">
                <div className="p-1.5 bg-blue-500/10 rounded-lg mt-0.5 shrink-0">
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-white">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guide faculty */}
        {pg.guideFaculty && (
          <section>
            <SectionLabel>Guide Faculty</SectionLabel>
            <div className="flex items-center gap-4 bg-white/[0.03] border border-blue-500/15 rounded-xl p-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 border border-blue-500/25 flex items-center justify-center shrink-0">
                <GraduationCap className="h-5 w-5 text-blue-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-white">{pg.guideFaculty}</p>
                {pg.guideFacultyEmail && (
                  <a href={`mailto:${pg.guideFacultyEmail}`}
                    className="text-sm text-blue-400 hover:text-cyan-300 flex items-center gap-1 mt-0.5 transition-colors truncate">
                    <Mail className="h-3.5 w-3.5 shrink-0" />{pg.guideFacultyEmail}
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
              <motion.div key={member.memberId}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3.5 bg-white/[0.03] border border-blue-500/10 rounded-xl hover:bg-white/[0.06] hover:border-blue-400/25 transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} border border-blue-500/20 flex items-center justify-center text-sm font-bold shrink-0`}>
                  {getInitials(member.studentName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-white truncate">{member.studentName}</p>
                    {member.isLeader && (
                      <span className="text-[9px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded shrink-0 flex items-center gap-0.5">
                        <Crown className="h-2 w-2" />LEAD
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{member.studentEmail}</p>
                  {member.cgpa && (
                    <p className="text-xs text-blue-400/70 mt-0.5">CGPA: {member.cgpa}</p>
                  )}
                </div>
                <div className="shrink-0 text-right">
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

      {/* Footer */}
      <div className="shrink-0 px-6 py-4 border-t border-blue-500/15 bg-[#080E1E]">
        <Button onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 rounded-xl shadow-lg shadow-blue-500/20 text-base py-5">
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