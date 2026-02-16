// /components/admin/AdminUserManagement.tsx
"use client";

import { useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Search,
    Shield,
    GraduationCap,
    BookOpen,
    UserCheck,
    UserX,
    ChevronDown,
    RefreshCw,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    MoreHorizontal,
    ArrowUpRight,
    Mail,
    Clock,
    Sparkles,
    Filter,
    UserCog,
    Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateUserRole, toggleUserActive, getAllUsers, getUserStats } from "@/app/actions/adminActions";

interface User {
    userid: number;
    clerkid: string;
    email: string;
    name: string | null;
    role: "ADMIN" | "FACULTY" | "STUDENT";
    isactive: boolean;
    created: Date;
    modified: Date | null;
}

interface Stats {
    totalUsers: number;
    adminCount: number;
    facultyCount: number;
    studentCount: number;
    activeCount: number;
    inactiveCount: number;
}

interface AdminUserManagementProps {
    initialUsers: User[];
    initialStats: Stats;
}

const roleConfig = {
    ADMIN: {
        label: "Admin",
        icon: Crown,
        gradient: "from-rose-500 to-orange-500",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200",
        dot: "bg-rose-500",
        iconBg: "bg-gradient-to-br from-rose-500 to-orange-500",
    },
    FACULTY: {
        label: "Faculty",
        icon: BookOpen,
        gradient: "from-blue-500 to-indigo-500",
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
        iconBg: "bg-gradient-to-br from-blue-500 to-indigo-500",
    },
    STUDENT: {
        label: "Student",
        icon: GraduationCap,
        gradient: "from-emerald-500 to-teal-500",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        iconBg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
};

type RoleFilter = "ALL" | "ADMIN" | "FACULTY" | "STUDENT";

export function AdminUserManagement({ initialUsers, initialStats }: AdminUserManagementProps) {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [stats, setStats] = useState<Stats>(initialStats);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
    const [isPending, startTransition] = useTransition();
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

    // Filtered users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                !searchQuery ||
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.clerkid.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

            return matchesSearch && matchesRole;
        });
    }, [users, searchQuery, roleFilter]);

    // Show toast feedback
    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(null), 4000);
    };

    // Handle role change
    const handleRoleChange = (userId: number, newRole: "ADMIN" | "FACULTY" | "STUDENT") => {
        setUpdatingUserId(userId);
        startTransition(async () => {
            try {
                const updatedUser = await updateUserRole(userId, newRole);
                setUsers((prev) =>
                    prev.map((u) => (u.userid === userId ? { ...u, ...updatedUser } : u))
                );
                // Refresh stats too
                const newStats = await getUserStats();
                setStats(newStats);
                showSuccess(`Role updated to ${roleConfig[newRole].label} successfully! Clerk metadata synced.`);
            } catch (err: unknown) {
                showError(`Failed to update role: ${err instanceof Error ? err.message : "Unknown error"}`);
            } finally {
                setUpdatingUserId(null);
            }
        });
    };

    // Handle toggle active
    const handleToggleActive = (userId: number, isActive: boolean) => {
        setTogglingUserId(userId);
        startTransition(async () => {
            try {
                const updatedUser = await toggleUserActive(userId, isActive);
                setUsers((prev) =>
                    prev.map((u) => (u.userid === userId ? { ...u, ...updatedUser } : u))
                );
                const newStats = await getUserStats();
                setStats(newStats);
                showSuccess(`User ${isActive ? "activated" : "deactivated"} successfully!`);
            } catch (err: unknown) {
                showError(`Failed to toggle user: ${err instanceof Error ? err.message : "Unknown error"}`);
            } finally {
                setTogglingUserId(null);
            }
        });
    };

    // Refresh data
    const handleRefresh = () => {
        startTransition(async () => {
            try {
                const [newUsers, newStats] = await Promise.all([getAllUsers(), getUserStats()]);
                setUsers(newUsers);
                setStats(newStats);
                showSuccess("Data refreshed successfully!");
            } catch (err) {
                showError("Failed to refresh data");
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            gradient: "from-emerald-500 to-teal-600",
            bg: "bg-emerald-50",
            iconColor: "text-white",
        },
        {
            label: "Admins",
            value: stats.adminCount,
            icon: Crown,
            gradient: "from-rose-500 to-orange-500",
            bg: "bg-rose-50",
            iconColor: "text-white",
        },
        {
            label: "Faculty",
            value: stats.facultyCount,
            icon: BookOpen,
            gradient: "from-blue-500 to-indigo-500",
            bg: "bg-blue-50",
            iconColor: "text-white",
        },
        {
            label: "Students",
            value: stats.studentCount,
            icon: GraduationCap,
            gradient: "from-violet-500 to-purple-500",
            bg: "bg-violet-50",
            iconColor: "text-white",
        },
        {
            label: "Active",
            value: stats.activeCount,
            icon: UserCheck,
            gradient: "from-green-500 to-emerald-500",
            bg: "bg-green-50",
            iconColor: "text-white",
        },
        {
            label: "Inactive",
            value: stats.inactiveCount,
            icon: UserX,
            gradient: "from-slate-400 to-slate-500",
            bg: "bg-slate-50",
            iconColor: "text-white",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Toast Notifications */}
            <AnimatePresence>
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 z-[100] flex items-center gap-3 bg-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-2xl shadow-emerald-500/30"
                    >
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{successMessage}</span>
                    </motion.div>
                )}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-20 left-1/2 z-[100] flex items-center gap-3 bg-red-600 text-white px-6 py-3.5 rounded-xl shadow-2xl shadow-red-500/30"
                    >
                        <XCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl">
                                    <UserCog className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                                        User Management
                                    </h1>
                                    <p className="text-slate-500 text-sm">
                                        Manage users, roles & permissions — synced with Clerk
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isPending}
                                className="border-slate-200 hover:bg-slate-50"
                            >
                                <RefreshCw
                                    className={cn("h-4 w-4 mr-2", isPending && "animate-spin")}
                                />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ y: -3, transition: { duration: 0.2 } }}
                            className="group relative bg-white rounded-2xl border border-slate-200 p-4 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
                        >
                            {/* Subtle glow on hover */}
                            <div
                                className={cn(
                                    "absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-0 group-hover:opacity-30 transition-opacity blur-2xl",
                                    stat.bg
                                )}
                            />
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div
                                    className={cn(
                                        "p-2 rounded-xl mb-2 bg-gradient-to-br",
                                        stat.gradient
                                    )}
                                >
                                    <stat.icon className="h-4 w-4 text-white" />
                                </div>
                                <motion.span
                                    key={stat.value}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-2xl font-bold text-slate-900"
                                >
                                    {stat.value}
                                </motion.span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {stat.label}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search users by name, email, or Clerk ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white h-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Select
                                value={roleFilter}
                                onValueChange={(v) => setRoleFilter(v as RoleFilter)}
                            >
                                <SelectTrigger className="w-[160px] bg-slate-50 border-slate-200">
                                    <Filter className="h-4 w-4 mr-2 text-slate-400" />
                                    <SelectValue placeholder="Filter Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                            Admin
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="FACULTY">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Faculty
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="STUDENT">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            Student
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {/* Active filter pill */}
                    {(searchQuery || roleFilter !== "ALL") && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100"
                        >
                            <span className="text-xs text-slate-500">Filters:</span>
                            {searchQuery && (
                                <Badge
                                    variant="outline"
                                    className="text-xs cursor-pointer hover:bg-red-50"
                                    onClick={() => setSearchQuery("")}
                                >
                                    Search: &quot;{searchQuery}&quot; ✕
                                </Badge>
                            )}
                            {roleFilter !== "ALL" && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-xs cursor-pointer hover:bg-red-50",
                                        roleConfig[roleFilter].border,
                                        roleConfig[roleFilter].text
                                    )}
                                    onClick={() => setRoleFilter("ALL")}
                                >
                                    {roleConfig[roleFilter].label} ✕
                                </Badge>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-slate-400 hover:text-red-500 ml-auto h-6"
                                onClick={() => {
                                    setSearchQuery("");
                                    setRoleFilter("ALL");
                                }}
                            >
                                Clear all
                            </Button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Results count */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex items-center justify-between mb-4"
                >
                    <p className="text-sm text-slate-500">
                        Showing{" "}
                        <span className="font-semibold text-slate-700">
                            {filteredUsers.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-700">
                            {users.length}
                        </span>{" "}
                        users
                    </p>
                </motion.div>

                {/* Users List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredUsers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-2xl border border-slate-200 p-16 text-center"
                            >
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="inline-block mb-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-emerald-200 rounded-2xl blur-xl opacity-40" />
                                        <div className="relative bg-emerald-50 border border-emerald-100 p-8 rounded-2xl">
                                            <Users className="h-16 w-16 text-emerald-400 mx-auto" />
                                        </div>
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                    No Users Found
                                </h3>
                                <p className="text-slate-500 max-w-md mx-auto">
                                    {searchQuery || roleFilter !== "ALL"
                                        ? "No users match your current filters. Try adjusting your search or filter criteria."
                                        : "No users have been registered yet. Users will appear here once they sign up."}
                                </p>
                            </motion.div>
                        ) : (
                            filteredUsers.map((user, index) => {
                                const config = roleConfig[user.role];
                                const isExpanded = expandedUserId === user.userid;
                                const isUpdating = updatingUserId === user.userid;
                                const isToggling = togglingUserId === user.userid;

                                return (
                                    <motion.div
                                        key={user.userid}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={cn(
                                            "group bg-white rounded-2xl border overflow-hidden transition-all duration-300",
                                            isExpanded
                                                ? "border-emerald-200 shadow-lg shadow-emerald-100/50 ring-1 ring-emerald-100"
                                                : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                        )}
                                    >
                                        {/* Main Row */}
                                        <div
                                            className="flex items-center gap-4 p-5 cursor-pointer"
                                            onClick={() =>
                                                setExpandedUserId(isExpanded ? null : user.userid)
                                            }
                                        >
                                            {/* Avatar */}
                                            <div className="relative flex-shrink-0">
                                                <div
                                                    className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg",
                                                        config.iconBg
                                                    )}
                                                >
                                                    {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                                                </div>
                                                {/* Active dot */}
                                                <div
                                                    className={cn(
                                                        "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                                                        user.isactive ? "bg-green-500" : "bg-slate-300"
                                                    )}
                                                />
                                            </div>

                                            {/* User Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-semibold text-slate-900 truncate">
                                                        {user.name || "Unnamed User"}
                                                    </h3>
                                                    <Badge
                                                        className={cn(
                                                            "text-[10px] px-2 py-0 h-5 font-semibold",
                                                            config.bg,
                                                            config.text,
                                                            config.border
                                                        )}
                                                    >
                                                        <config.icon className="h-3 w-3 mr-1" />
                                                        {config.label}
                                                    </Badge>
                                                    {!user.isactive && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px] px-1.5 py-0 h-5 border-slate-200 text-slate-400"
                                                        >
                                                            Inactive
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1 truncate">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </span>
                                                    <span className="hidden sm:flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDate(user.created)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Quick Role Selector (visible on desktop) */}
                                            <div
                                                className="hidden md:block"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(v) =>
                                                        handleRoleChange(
                                                            user.userid,
                                                            v as "ADMIN" | "FACULTY" | "STUDENT"
                                                        )
                                                    }
                                                    disabled={isUpdating}
                                                >
                                                    <SelectTrigger
                                                        className={cn(
                                                            "w-[140px] h-9 text-sm font-medium transition-all",
                                                            isUpdating && "opacity-60 cursor-wait",
                                                            config.bg,
                                                            config.text,
                                                            config.border
                                                        )}
                                                    >
                                                        {isUpdating ? (
                                                            <div className="flex items-center gap-2">
                                                                <RefreshCw className="h-3 w-3 animate-spin" />
                                                                Updating...
                                                            </div>
                                                        ) : (
                                                            <SelectValue />
                                                        )}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ADMIN">
                                                            <div className="flex items-center gap-2">
                                                                <Crown className="h-4 w-4 text-rose-500" />
                                                                Admin
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="FACULTY">
                                                            <div className="flex items-center gap-2">
                                                                <BookOpen className="h-4 w-4 text-blue-500" />
                                                                Faculty
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="STUDENT">
                                                            <div className="flex items-center gap-2">
                                                                <GraduationCap className="h-4 w-4 text-emerald-500" />
                                                                Student
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Expand Arrow */}
                                            <motion.div
                                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ChevronDown className="h-5 w-5 text-slate-400" />
                                            </motion.div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-5 pb-5 pt-0">
                                                        <div className="border-t border-slate-100 pt-5">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                {/* Left: User Details */}
                                                                <div className="space-y-4">
                                                                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                                        <Sparkles className="h-4 w-4 text-emerald-500" />
                                                                        User Details
                                                                    </h4>
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                                            <span className="text-sm text-slate-500">
                                                                                User ID
                                                                            </span>
                                                                            <span className="text-sm font-mono font-medium text-slate-700">
                                                                                #{user.userid}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                                            <span className="text-sm text-slate-500">
                                                                                Clerk ID
                                                                            </span>
                                                                            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                                                                {user.clerkid.substring(0, 20)}...
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                                            <span className="text-sm text-slate-500">
                                                                                Email
                                                                            </span>
                                                                            <span className="text-sm font-medium text-slate-700">
                                                                                {user.email}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                                                            <span className="text-sm text-slate-500">
                                                                                Joined
                                                                            </span>
                                                                            <span className="text-sm text-slate-700">
                                                                                {formatDate(user.created)}{" "}
                                                                                <span className="text-slate-400">
                                                                                    at {formatTime(user.created)}
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        {user.modified && (
                                                                            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                                                                                <span className="text-sm text-amber-600">
                                                                                    Last Modified
                                                                                </span>
                                                                                <span className="text-sm font-medium text-amber-700">
                                                                                    {formatDate(user.modified)}{" "}
                                                                                    <span className="text-amber-500">
                                                                                        at {formatTime(user.modified)}
                                                                                    </span>
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Right: Actions */}
                                                                <div className="space-y-4">
                                                                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                                                        <Shield className="h-4 w-4 text-emerald-500" />
                                                                        Role & Status
                                                                    </h4>

                                                                    {/* Role Selector (for mobile - always visible here) */}
                                                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                                                                            Change Role
                                                                        </label>
                                                                        <p className="text-xs text-slate-400 mb-3">
                                                                            This will update both the database and
                                                                            Clerk user metadata
                                                                        </p>
                                                                        <div className="grid grid-cols-3 gap-2">
                                                                            {(
                                                                                ["ADMIN", "FACULTY", "STUDENT"] as const
                                                                            ).map((role) => {
                                                                                const rc = roleConfig[role];
                                                                                const isCurrentRole =
                                                                                    user.role === role;
                                                                                return (
                                                                                    <motion.button
                                                                                        key={role}
                                                                                        whileHover={{ scale: 1.02 }}
                                                                                        whileTap={{ scale: 0.98 }}
                                                                                        onClick={() =>
                                                                                            !isCurrentRole &&
                                                                                            !isUpdating &&
                                                                                            handleRoleChange(
                                                                                                user.userid,
                                                                                                role
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            isCurrentRole || isUpdating
                                                                                        }
                                                                                        className={cn(
                                                                                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200",
                                                                                            isCurrentRole
                                                                                                ? cn(
                                                                                                    rc.bg,
                                                                                                    rc.border,
                                                                                                    "ring-2 ring-offset-1",
                                                                                                    role === "ADMIN"
                                                                                                        ? "ring-rose-300"
                                                                                                        : role === "FACULTY"
                                                                                                            ? "ring-blue-300"
                                                                                                            : "ring-emerald-300"
                                                                                                )
                                                                                                : "border-slate-200 hover:border-slate-300 bg-white cursor-pointer"
                                                                                        )}
                                                                                    >
                                                                                        <rc.icon
                                                                                            className={cn(
                                                                                                "h-5 w-5",
                                                                                                isCurrentRole
                                                                                                    ? rc.text
                                                                                                    : "text-slate-400"
                                                                                            )}
                                                                                        />
                                                                                        <span
                                                                                            className={cn(
                                                                                                "text-xs font-semibold",
                                                                                                isCurrentRole
                                                                                                    ? rc.text
                                                                                                    : "text-slate-500"
                                                                                            )}
                                                                                        >
                                                                                            {rc.label}
                                                                                        </span>
                                                                                        {isCurrentRole && (
                                                                                            <motion.div
                                                                                                layoutId={`check-${user.userid}`}
                                                                                            >
                                                                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                                                            </motion.div>
                                                                                        )}
                                                                                    </motion.button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        {isUpdating && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: -5 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                className="flex items-center gap-2 mt-3 p-2 bg-emerald-50 border border-emerald-100 rounded-lg"
                                                                            >
                                                                                <RefreshCw className="h-3 w-3 animate-spin text-emerald-600" />
                                                                                <span className="text-xs text-emerald-600 font-medium">
                                                                                    Updating role & syncing with
                                                                                    Clerk...
                                                                                </span>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>

                                                                    {/* Active Toggle */}
                                                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                                                        <div className="flex items-center justify-between">
                                                                            <div>
                                                                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                                                                                    Account Status
                                                                                </label>
                                                                                <p className="text-xs text-slate-400">
                                                                                    {user.isactive
                                                                                        ? "User can access the system"
                                                                                        : "User access is disabled"}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <Badge
                                                                                    className={cn(
                                                                                        "text-xs",
                                                                                        user.isactive
                                                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                                                            : "bg-slate-100 text-slate-500 border-slate-200"
                                                                                    )}
                                                                                >
                                                                                    {user.isactive
                                                                                        ? "Active"
                                                                                        : "Inactive"}
                                                                                </Badge>
                                                                                <Switch
                                                                                    checked={user.isactive}
                                                                                    onCheckedChange={(checked) =>
                                                                                        handleToggleActive(
                                                                                            user.userid,
                                                                                            checked
                                                                                        )
                                                                                    }
                                                                                    disabled={isToggling}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        {isToggling && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                className="flex items-center gap-2 mt-3"
                                                                            >
                                                                                <RefreshCw className="h-3 w-3 animate-spin text-slate-500" />
                                                                                <span className="text-xs text-slate-500">
                                                                                    Updating status...
                                                                                </span>
                                                                            </motion.div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
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

                {/* Legend Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-4 bg-white rounded-xl border border-slate-200"
                >
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Roles:</span>
                        {(["ADMIN", "FACULTY", "STUDENT"] as const).map((role) => {
                            const config = roleConfig[role];
                            return (
                                <div key={role} className="flex items-center gap-1.5">
                                    <div className={cn("w-2 h-2 rounded-full", config.dot)} />
                                    <span>{config.label}</span>
                                </div>
                            );
                        })}
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>Active</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <span>Inactive</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 text-emerald-500" />
                            <span>Changes sync to Clerk metadata</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
