// /components/profile/ProfileContent.tsx
"use client";

import { motion } from "framer-motion";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    Phone,
    Shield,
    Calendar,
    Clock,
    User,
    GraduationCap,
    Briefcase,
    FolderKanban,
    Crown,
    MapPin,
    LogOut,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Settings,
    Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProfileData {
    clerkId: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
    emailAddresses: { email: string; isPrimary: boolean }[];
    phoneNumbers: { phone: string }[];
    createdAtClerk: number;
    lastSignInAt: number | null;
    userid: number;
    email: string;
    name: string | null;
    role: string;
    isactive: boolean;
    createdAt: string;
    modifiedAt: string | null;
    student: {
        studentid: number;
        studentname: string;
        phone: string | null;
        email: string | null;
        description: string | null;
        projectGroups: {
            groupName: string;
            projectTitle: string | null;
            projectArea: string | null;
            isLeader: boolean;
        }[];
    } | null;
    staff: {
        staffid: number;
        staffname: string;
        phone: string | null;
        email: string | null;
        description: string | null;
    } | null;
}

interface ProfileContentProps {
    profile: ProfileData;
}

const roleConfig: Record<string, { label: string; color: string; gradient: string; icon: React.ElementType }> = {
    ADMIN: {
        label: "Administrator",
        color: "emerald",
        gradient: "from-emerald-500 to-teal-600",
        icon: Shield,
    },
    FACULTY: {
        label: "Faculty Member",
        color: "blue",
        gradient: "from-blue-500 to-indigo-600",
        icon: Briefcase,
    },
    STUDENT: {
        label: "Student",
        color: "violet",
        gradient: "from-violet-500 to-purple-600",
        icon: GraduationCap,
    },
};

function formatDate(dateInput: string | number | null) {
    if (!dateInput) return "N/A";
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatTime(dateInput: string | number | null) {
    if (!dateInput) return "N/A";
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function ProfileContent({ profile }: ProfileContentProps) {
    const router = useRouter();
    const role = roleConfig[profile.role] || roleConfig.STUDENT;
    const RoleIcon = role.icon;

    const dashboardHref =
        profile.role === "ADMIN"
            ? "/admin/dashboard"
            : profile.role === "FACULTY"
                ? "/faculty/dashboard"
                : "/student/dashboard";

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Banner */}
            <div className={cn("relative h-56 bg-gradient-to-r", role.gradient)}>
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Back button */}
                <div className="absolute top-6 left-6 z-10">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href={dashboardHref}>
                            <Button
                                variant="ghost"
                                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Decorative circles */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute -bottom-6 right-12 w-48 h-48 bg-white/5 rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-12 right-48 w-24 h-24 bg-white/5 rounded-full"
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-20 relative z-10 pb-12">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
                >
                    {/* Avatar + Name Section */}
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            {/* Avatar */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                className="relative"
                            >
                                <div className={cn("absolute -inset-1 bg-gradient-to-r rounded-full blur-sm opacity-60", role.gradient)} />
                                <div className="relative">
                                    <Image
                                        src={profile.imageUrl}
                                        alt={`${profile.firstName} ${profile.lastName}`}
                                        width={96}
                                        height={96}
                                        className="rounded-full ring-4 ring-white object-cover"
                                    />
                                    {/* Active indicator */}
                                    <div className={cn(
                                        "absolute bottom-1 right-1 h-5 w-5 rounded-full border-3 border-white",
                                        profile.isactive ? "bg-emerald-500" : "bg-slate-400"
                                    )} />
                                </div>
                            </motion.div>

                            {/* Name + Role */}
                            <div className="flex-1 text-center sm:text-left">
                                <motion.h1
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl md:text-3xl font-bold text-slate-900"
                                >
                                    {profile.firstName} {profile.lastName}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2"
                                >
                                    <Badge className={cn(
                                        "text-sm px-3 py-1",
                                        role.color === "emerald" && "bg-emerald-100 text-emerald-700",
                                        role.color === "blue" && "bg-blue-100 text-blue-700",
                                        role.color === "violet" && "bg-violet-100 text-violet-700"
                                    )}>
                                        <RoleIcon className="h-3.5 w-3.5 mr-1.5" />
                                        {role.label}
                                    </Badge>
                                    <Badge className={cn(
                                        "text-xs",
                                        profile.isactive
                                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                            : "bg-red-50 text-red-600 border-red-200"
                                    )}>
                                        {profile.isactive ? (
                                            <><CheckCircle2 className="h-3 w-3 mr-1" /> Active</>
                                        ) : (
                                            <><XCircle className="h-3 w-3 mr-1" /> Inactive</>
                                        )}
                                    </Badge>
                                </motion.div>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-slate-500 mt-2 text-sm"
                                >
                                    {profile.email}
                                </motion.p>
                            </div>

                            {/* Sign Out Button */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="sm:ml-auto"
                            >
                                <SignOutButton>
                                    <Button
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </SignOutButton>
                            </motion.div>
                        </div>
                    </div>

                    <Separator />

                    {/* Info Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-6 md:p-8"
                    >
                        <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-slate-400" />
                            Account Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Email */}
                            {profile.emailAddresses.map((e, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <Mail className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-medium text-slate-400 uppercase">
                                            Email {e.isPrimary && <span className="text-emerald-500">(Primary)</span>}
                                        </p>
                                        <p className="text-sm font-medium text-slate-800 truncate">{e.email}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Phone */}
                            {profile.phoneNumbers.length > 0 ? (
                                profile.phoneNumbers.map((p, i) => (
                                    <div key={i} className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                        <div className="bg-emerald-100 p-2 rounded-lg">
                                            <Phone className="h-4 w-4 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase">Phone</p>
                                            <p className="text-sm font-medium text-slate-800">{p.phone}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                    <div className="bg-slate-100 p-2 rounded-lg">
                                        <Phone className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase">Phone</p>
                                        <p className="text-sm text-slate-400 italic">Not provided</p>
                                    </div>
                                </div>
                            )}

                            {/* User ID */}
                            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                <div className="bg-violet-100 p-2 rounded-lg">
                                    <Hash className="h-4 w-4 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">User ID</p>
                                    <p className="text-sm font-mono text-slate-800">{profile.userid}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    role.color === "emerald" && "bg-emerald-100",
                                    role.color === "blue" && "bg-blue-100",
                                    role.color === "violet" && "bg-violet-100"
                                )}>
                                    <RoleIcon className={cn(
                                        "h-4 w-4",
                                        role.color === "emerald" && "text-emerald-600",
                                        role.color === "blue" && "text-blue-600",
                                        role.color === "violet" && "text-violet-600"
                                    )} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">Role</p>
                                    <p className="text-sm font-medium text-slate-800">{role.label}</p>
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    <Calendar className="h-4 w-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">Joined</p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {formatDate(profile.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Last Sign In */}
                            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-medium text-slate-400 uppercase">Last Sign In</p>
                                    <p className="text-sm font-medium text-slate-800">
                                        {formatTime(profile.lastSignInAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Student Section */}
                    {profile.student && (
                        <>
                            <Separator />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-6 md:p-8"
                            >
                                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-violet-500" />
                                    Student Profile
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-violet-50 rounded-xl p-4">
                                        <p className="text-[10px] font-medium text-violet-400 uppercase mb-1">Student Name</p>
                                        <p className="text-sm font-semibold text-slate-800">{profile.student.studentname}</p>
                                    </div>
                                    <div className="bg-violet-50 rounded-xl p-4">
                                        <p className="text-[10px] font-medium text-violet-400 uppercase mb-1">Student ID</p>
                                        <p className="text-sm font-mono text-slate-800">{profile.student.studentid}</p>
                                    </div>
                                    {profile.student.phone && (
                                        <div className="bg-violet-50 rounded-xl p-4">
                                            <p className="text-[10px] font-medium text-violet-400 uppercase mb-1">Phone</p>
                                            <p className="text-sm text-slate-800">{profile.student.phone}</p>
                                        </div>
                                    )}
                                    {profile.student.email && (
                                        <div className="bg-violet-50 rounded-xl p-4">
                                            <p className="text-[10px] font-medium text-violet-400 uppercase mb-1">Student Email</p>
                                            <p className="text-sm text-slate-800">{profile.student.email}</p>
                                        </div>
                                    )}
                                </div>

                                {profile.student.description && (
                                    <div className="bg-violet-50 rounded-xl p-4 mb-4">
                                        <p className="text-[10px] font-medium text-violet-400 uppercase mb-1">Bio</p>
                                        <p className="text-sm text-slate-700">{profile.student.description}</p>
                                    </div>
                                )}

                                {/* Project Groups */}
                                {profile.student.projectGroups.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                                            <FolderKanban className="h-4 w-4 text-blue-500" />
                                            Project Groups ({profile.student.projectGroups.length})
                                        </h3>
                                        <div className="space-y-2">
                                            {profile.student.projectGroups.map((pg, i) => (
                                                <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium text-slate-800 text-sm">{pg.groupName}</p>
                                                        {pg.projectTitle && (
                                                            <p className="text-xs text-slate-500 mt-0.5">{pg.projectTitle}</p>
                                                        )}
                                                        {pg.projectArea && (
                                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                                                <MapPin className="h-3 w-3" />
                                                                {pg.projectArea}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {pg.isLeader && (
                                                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            Leader
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </>
                    )}

                    {/* Staff Section */}
                    {profile.staff && (
                        <>
                            <Separator />
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="p-6 md:p-8"
                            >
                                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="h-5 w-5 text-blue-500" />
                                    Staff Profile
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <p className="text-[10px] font-medium text-blue-400 uppercase mb-1">Staff Name</p>
                                        <p className="text-sm font-semibold text-slate-800">{profile.staff.staffname}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-4">
                                        <p className="text-[10px] font-medium text-blue-400 uppercase mb-1">Staff ID</p>
                                        <p className="text-sm font-mono text-slate-800">{profile.staff.staffid}</p>
                                    </div>
                                    {profile.staff.phone && (
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <p className="text-[10px] font-medium text-blue-400 uppercase mb-1">Phone</p>
                                            <p className="text-sm text-slate-800">{profile.staff.phone}</p>
                                        </div>
                                    )}
                                    {profile.staff.email && (
                                        <div className="bg-blue-50 rounded-xl p-4">
                                            <p className="text-[10px] font-medium text-blue-400 uppercase mb-1">Staff Email</p>
                                            <p className="text-sm text-slate-800">{profile.staff.email}</p>
                                        </div>
                                    )}
                                    {profile.staff.description && (
                                        <div className="bg-blue-50 rounded-xl p-4 sm:col-span-2">
                                            <p className="text-[10px] font-medium text-blue-400 uppercase mb-1">Bio</p>
                                            <p className="text-sm text-slate-700">{profile.staff.description}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}

                    {/* Footer Actions */}
                    <Separator />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="p-6 md:p-8 bg-slate-50/50"
                    >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-xs text-slate-400">
                                Clerk ID: <span className="font-mono">{profile.clerkId}</span>
                            </p>
                            <div className="flex gap-3">
                                <Link href={dashboardHref}>
                                    <Button variant="outline" className="border-slate-200 text-slate-600">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Go to Dashboard
                                    </Button>
                                </Link>
                                <SignOutButton>
                                    <Button className="bg-red-500 hover:bg-red-600 text-white">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </SignOutButton>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
