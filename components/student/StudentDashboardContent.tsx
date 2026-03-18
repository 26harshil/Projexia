// /components/student/StudentDashboardContent.tsx
"use client";

import { motion } from "framer-motion";
import {
    FolderKanban,
    Calendar,
    Bell,
    Users,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Circle,
    Clock,
    MapPin,
    User,
    Crown,
    Mail,
    Phone,
    ClipboardCheck,
    XCircle,
    CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ProjectDetails {
    projectgroupid: number;
    projectgroupname: string;
    projecttitle: string | null;
    projectarea: string | null;
    projectdescription: string | null;
    guidestaffname: string | null;
    averagecpi: any;
    projecttype: {
        projecttypeid: number;
        projecttypename: string;
    } | null;
    convener: {
        staffid: number;
        staffname: string;
        email: string | null;
        phone: string | null;
    } | null;
    expert: {
        staffid: number;
        staffname: string;
        email: string | null;
        phone: string | null;
    } | null;
}

interface TeamMember {
    studentid: number;
    studentname: string;
    email: string | null;
    phone: string | null;
    isgroupleader: boolean;
    studentcgpa: any;
}

interface Meeting {
    projectmeetingid: number;
    meetingdatetime: Date;
    meetingpurpose: string | null;
    meetinglocation: string | null;
    meetingstatus: string | null;
    meetingnotes: string | null;
    staff: {
        staffname: string;
        email: string | null;
    };
}

interface AttendanceRecord {
    projectmeetingattendanceid: number;
    ispresent: boolean;
    attendanceremarks: string | null;
    projectmeeting: {
        meetingdatetime: Date;
        meetingpurpose: string | null;
        meetinglocation: string | null;
    };
}

interface Announcement {
    id: number;
    title: string;
    content: string | null;
    createdAt: Date;
    author: {
        name: string | null;
        role: string;
    };
}

interface StudentDashboardContentProps {
    studentName: string;
    projectDetails: ProjectDetails | null;
    teamMembers: TeamMember[];
    upcomingMeetings: Meeting[];
    pastMeetings: Meeting[];
    attendanceRecords: AttendanceRecord[];
    announcements: Announcement[];
    projectProgress: number;
    isGroupLeader: boolean;
}

// ============================================
// ANIMATION VARIANTS
// ============================================

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

// ============================================
// MAIN COMPONENT
// ============================================

export function StudentDashboardContent({
    studentName,
    projectDetails,
    teamMembers,
    upcomingMeetings,
    pastMeetings,
    attendanceRecords,

    projectProgress,
    isGroupLeader,
}: StudentDashboardContentProps) {
    // Calculate progress milestones based on project progress
    const progressItems = [
        {
            name: "Project Proposal",
            progress: projectProgress >= 33 ? 100 : Math.min(100, projectProgress * 3),
            color: "from-green-500 to-emerald-500",
        },
        {
            name: "Development",
            progress: projectProgress >= 66 ? 100 : Math.max(0, Math.min(100, (projectProgress - 33) * 3)),
            color: "from-blue-500 to-emerald-500",
        },
        {
            name: "Final Report",
            progress: Math.max(0, Math.min(100, (projectProgress - 66) * 3)),
            color: "from-emerald-500 to-teal-500",
        },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Row 1: My Project + Progress Tracker */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* My Project Card - Spans 2 columns */}
                <motion.div variants={itemVariants} className="lg:col-span-2">
                    <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25"
                                    >
                                        <FolderKanban className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">My Project</h3>
                                        <p className="text-sm text-slate-500">Your enrolled project details</p>
                                    </div>
                                </div>
                                {projectDetails && (
                                    <Link href="/student/project">
                                        <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-400 hover:bg-blue-500/10">
                                            View Details
                                            <ArrowRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {projectDetails ? (
                                <div className="space-y-4">
                                    <div className="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white mb-1">
                                                    {projectDetails.projecttitle || projectDetails.projectgroupname}
                                                </h4>
                                                {projectDetails.projectarea && (
                                                    <p className="text-sm text-slate-300 mb-2 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {projectDetails.projectarea}
                                                    </p>
                                                )}
                                            </div>
                                            {projectDetails.projecttype && (
                                                <Badge className="bg-blue-600 text-white shrink-0">
                                                    {projectDetails.projecttype.projecttypename}
                                                </Badge>
                                            )}
                                        </div>

                                        {projectDetails.projectdescription && (
                                            <p className="text-sm text-slate-200 mb-4 line-clamp-2">
                                                {projectDetails.projectdescription}
                                            </p>
                                        )}

                                        {/* Guide Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            {projectDetails.convener && (
                                                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-500/20">
                                                    <div className="p-2 bg-blue-500/15 rounded-full">
                                                        <User className="h-4 w-4 text-cyan-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-slate-500">Convener</p>
                                                        <p className="font-medium text-white text-sm truncate">
                                                            {projectDetails.convener.staffname}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {projectDetails.expert && (
                                                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-cyan-500/20">
                                                    <div className="p-2 bg-cyan-500/15 rounded-full">
                                                        <User className="h-4 w-4 text-cyan-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-slate-500">Expert Guide</p>
                                                        <p className="font-medium text-white text-sm truncate">
                                                            {projectDetails.expert.staffname}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {projectDetails.guidestaffname && !projectDetails.convener && (
                                                <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-blue-500/20 md:col-span-2">
                                                    <div className="p-2 bg-blue-500/15 rounded-full">
                                                        <User className="h-4 w-4 text-blue-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-slate-500">Guide</p>
                                                        <p className="font-medium text-white text-sm">
                                                            {projectDetails.guidestaffname}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <motion.div
                                        animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-2xl opacity-20" />
                                        <div className="relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-6 rounded-2xl">
                                            <FolderKanban className="h-16 w-16 text-blue-400" />
                                        </div>
                                    </motion.div>
                                    <p className="text-slate-300 mt-6 font-medium">No projects enrolled yet</p>
                                    <p className="text-sm text-slate-400 mt-1 text-center max-w-xs">
                                        Contact your faculty to get assigned to a project group
                                    </p>
                                    <Button className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/25">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Explore Projects
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Progress Tracker Card */}
                <motion.div variants={itemVariants}>
                    <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Progress</h3>
                                    <p className="text-sm text-slate-500">Track milestones</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {progressItems.map((item, index) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <div className="p-4 bg-gradient-to-r from-white/5 to-white/3 rounded-xl border border-blue-500/15 hover:border-cyan-500/25 transition-all duration-300">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {Math.round(item.progress) >= 100 ? (
                                                        <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                                                    ) : (
                                                        <Circle className="h-4 w-4 text-slate-300" />
                                                    )}
                                                    <p className="text-sm font-medium text-slate-200">{item.name}</p>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {Math.round(item.progress)}%
                                                </Badge>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.progress}%` }}
                                                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                                                    className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Row 2: Team Members + Upcoming Meetings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Team Members Card */}
                <motion.div variants={itemVariants}>
                    <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/15 to-blue-500/15 rounded-full blur-2xl opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        className="p-3 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25"
                                    >
                                        <Users className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">My Group</h3>
                                        <p className="text-sm text-slate-500">{teamMembers.length} members</p>
                                    </div>
                                </div>
                                {isGroupLeader && (
                                    <Badge className="bg-amber-500 text-white">
                                        <Crown className="h-3 w-3 mr-1" />
                                        You're the Leader
                                    </Badge>
                                )}
                            </div>

                            {teamMembers.length > 0 ? (
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {teamMembers.map((member, index) => (
                                        <motion.div
                                            key={member.studentid}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/20 hover:border-cyan-500/25 transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-cyan-600 rounded-full shrink-0">
                                                    <User className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-sm font-semibold text-white">
                                                            {member.studentname}
                                                        </p>
                                                        {member.isgroupleader && (
                                                            <Badge className="bg-amber-500 text-white text-xs">
                                                                <Crown className="h-3 w-3 mr-1" />
                                                                Leader
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {member.email && (
                                                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                            <Mail className="h-3 w-3" />
                                                            {member.email}
                                                        </p>
                                                    )}
                                                    {member.studentcgpa && (
                                                        <p className="text-xs text-slate-300 mt-1">
                                                            CGPA: {Number(member.studentcgpa).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-4 rounded-xl"
                                    >
                                        <Users className="h-12 w-12 text-cyan-400" />
                                    </motion.div>
                                    <p className="text-slate-500 mt-4 text-sm">No team assigned yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Upcoming Meetings Card */}
                <motion.div variants={itemVariants}>
                    <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-2xl opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/25"
                                    >
                                        <Calendar className="h-5 w-5 text-white" />
                                    </motion.div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">Upcoming Meetings</h3>
                                        <p className="text-sm text-slate-500">{upcomingMeetings.length} scheduled</p>
                                    </div>
                                </div>
                            </div>

                            {upcomingMeetings.length > 0 ? (
                                <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {upcomingMeetings.slice(0, 5).map((meeting, index) => (
                                        <motion.div
                                            key={meeting.projectmeetingid}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20 hover:border-blue-500/25 transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 bg-blue-600 rounded-lg shrink-0">
                                                    <CalendarClock className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white mb-1">
                                                        {meeting.meetingpurpose || "Project Meeting"}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-300 mb-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>
                                                            {new Date(meeting.meetingdatetime).toLocaleDateString("en-IN", {
                                                                weekday: "short",
                                                                day: "numeric",
                                                                month: "short",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </div>
                                                    {meeting.meetinglocation && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-300">
                                                            <MapPin className="h-3 w-3" />
                                                            <span>{meeting.meetinglocation}</span>
                                                        </div>
                                                    )}
                                                    {meeting.staff && (
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            With: {meeting.staff.staffname}
                                                        </p>
                                                    )}
                                                    {meeting.meetingstatus && (
                                                        <Badge variant="secondary" className="mt-2 text-xs">
                                                            {meeting.meetingstatus}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 rounded-xl"
                                    >
                                        <Calendar className="h-12 w-12 text-blue-400" />
                                    </motion.div>
                                    <p className="text-slate-500 mt-4 text-sm">No upcoming meetings</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Row 3: Attendance + Announcements */}


            {/* Row 4: Past Meetings (if any) */}
            {pastMeetings.length > 0 && (
                <motion.div variants={itemVariants}>
                    <div className="relative bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 p-6 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-white/5 rounded-full blur-2xl opacity-50" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <motion.div
                                    whileHover={{ rotate: 15 }}
                                    className="p-3 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25"
                                >
                                    <CalendarClock className="h-5 w-5 text-white" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Past Meetings</h3>
                                    <p className="text-sm text-slate-500">{pastMeetings.length} completed</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {pastMeetings.slice(0, 6).map((meeting, index) => (
                                    <motion.div
                                        key={meeting.projectmeetingid}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-4 bg-gradient-to-r from-white/5 to-white/3 rounded-xl border border-blue-500/15"
                                    >
                                        <p className="text-sm font-medium text-slate-200 mb-1">
                                            {meeting.meetingpurpose || "Project Meeting"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(meeting.meetingdatetime).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                        {meeting.meetingstatus && (
                                            <Badge variant="outline" className="mt-2 text-xs">
                                                {meeting.meetingstatus}
                                            </Badge>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}