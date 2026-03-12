// /components/faculty/FacultyGroupsContent.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    Plus,
    Search,
    Filter,
    LayoutGrid,
    List,
    UserPlus,
    ChevronRight,
    Calendar,
    MapPin,
    Mail,
    Phone,
    Crown,
    User,
    FolderKanban,
    X,
    Check,
    Loader2,
    GraduationCap,
    Trash2,
    Edit,
    Save,
    Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createGroup, updateGroup, deleteGroup, markGroupComplete, addGroupMember, removeGroupMember } from "@/app/actions/getFacultyData";
import { generateGroupReportPDF } from "@/lib/pdfGenerator";

interface GroupMember {
    id: number | undefined;
    name: string | undefined;
    email: string | null | undefined;
    phone: string | null | undefined;
    isLeader: boolean | null;
    cgpa: number | null;
}

interface Group {
    id: number;
    name: string;
    title: string | null;
    area: string | null;
    description: string | null;
    projectType: string | null;
    status: string;
    averageCpi: number | null;
    convener: { staffname: string; email: string | null } | null;
    expert: { staffname: string; email: string | null } | null;
    memberCount: number;
    members: GroupMember[];
    nextMeeting: {
        meetingdatetime: Date;
        meetingpurpose: string | null;
        meetinglocation: string | null;
    } | null;
}

interface Student {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    isInGroup: boolean;
    groupCount: number;
}

interface ProjectType {
    id: number;
    name: string;
    description: string | null;
}

interface Staff {
    id: number;
    name: string;
    email: string | null;
}

interface FacultyGroupsContentProps {
    groups: Group[];
    students: Student[];
    projectTypes: ProjectType[];
    staffList: Staff[];
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

export function FacultyGroupsContent({ groups, students, projectTypes, staffList }: FacultyGroupsContentProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredGroups = groups.filter(
        (group) =>
            group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.area?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeGroups = filteredGroups.filter((g) => g.status !== "Completed");
    const completedGroups = filteredGroups.filter((g) => g.status === "Completed");

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
                            My Groups
                        </h1>
                        <p className="text-slate-500">
                            {groups.length} student groups under your supervision
                        </p>
                    </div>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create Group
                    </Button>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl border border-slate-200 p-4 mb-6"
                >
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search groups..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="border-slate-200">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            <div className="flex border border-slate-200 rounded-lg p-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 rounded-md ${viewMode === "grid" ? "bg-slate-100" : ""}`}
                                    onClick={() => setViewMode("grid")}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`h-8 w-8 rounded-md ${viewMode === "list" ? "bg-slate-100" : ""}`}
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-white border border-slate-200 p-1 mb-6">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                            >
                                All Groups ({filteredGroups.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="active"
                                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                            >
                                Active ({activeGroups.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                            >
                                Completed ({completedGroups.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            {filteredGroups.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                            : "space-y-4"
                                    }
                                >
                                    {filteredGroups.map((group) => (
                                        <GroupCard
                                            key={group.id}
                                            group={group}
                                            viewMode={viewMode}
                                            onViewDetails={() => setSelectedGroup(group)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState onCreateGroup={() => setShowCreateModal(true)} />
                            )}
                        </TabsContent>

                        <TabsContent value="active">
                            {activeGroups.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                            : "space-y-4"
                                    }
                                >
                                    {activeGroups.map((group) => (
                                        <GroupCard
                                            key={group.id}
                                            group={group}
                                            viewMode={viewMode}
                                            onViewDetails={() => setSelectedGroup(group)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                    <p className="text-slate-500">No active groups</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="completed">
                            {completedGroups.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className={
                                        viewMode === "grid"
                                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                            : "space-y-4"
                                    }
                                >
                                    {completedGroups.map((group) => (
                                        <GroupCard
                                            key={group.id}
                                            group={group}
                                            viewMode={viewMode}
                                            onViewDetails={() => setSelectedGroup(group)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                                    <p className="text-slate-500">No completed groups</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* Group Details Modal */}
            <AnimatePresence>
                {selectedGroup && (
                    <GroupDetailsModal
                        group={selectedGroup}
                        students={students}
                        onClose={() => {
                            setSelectedGroup(null);
                            window.location.reload();
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Create Group Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateGroupModal
                        students={students}
                        projectTypes={projectTypes}
                        staffList={staffList}
                        onClose={() => {
                            setShowCreateModal(false);
                            window.location.reload();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ===================== GROUP CARD COMPONENT =====================

function GroupCard({
    group,
    viewMode,
    onViewDetails
}: {
    group: Group;
    viewMode: "grid" | "list";
    onViewDetails: () => void;
}) {
    const leader = group.members.find((m) => m.isLeader);

    if (viewMode === "list") {
        return (
            <motion.div variants={itemVariants}>
                <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 rounded-xl shrink-0">
                            <Users className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900 truncate">
                                    {group.title || group.name}
                                </h3>
                                {group.projectType && (
                                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                        {group.projectType}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {group.memberCount} members
                                </span>
                                {group.area && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {group.area}
                                    </span>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600"
                            onClick={onViewDetails}
                        >
                            View <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div variants={itemVariants}>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-amber-100 rounded-xl">
                        <FolderKanban className="h-5 w-5 text-amber-600" />
                    </div>
                    {group.projectType && (
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            {group.projectType}
                        </Badge>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                        {group.title || group.name}
                    </h3>
                    {group.area && (
                        <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                            <MapPin className="h-3 w-3" />
                            {group.area}
                        </p>
                    )}
                    {group.description && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                            {group.description}
                        </p>
                    )}

                    {/* Members Preview */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex -space-x-2">
                            {group.members.slice(0, 3).map((member, index) => (
                                <div
                                    key={member.id || index}
                                    className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full border-2 border-white flex items-center justify-center"
                                >
                                    <span className="text-white text-xs font-medium">
                                        {member.name?.charAt(0) || "?"}
                                    </span>
                                </div>
                            ))}
                            {group.memberCount > 3 && (
                                <div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-slate-600 text-xs font-medium">
                                        +{group.memberCount - 3}
                                    </span>
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-slate-500">{group.memberCount} members</span>
                    </div>

                    {/* Leader */}
                    {leader && (
                        <div className="flex items-center gap-2 p-2 bg-amber-50 rounded-lg mb-4">
                            <Crown className="h-4 w-4 text-amber-600" />
                            <span className="text-sm text-amber-700 font-medium">
                                Leader: {leader.name}
                            </span>
                        </div>
                    )}

                    {/* Next Meeting */}
                    {group.nextMeeting && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <div className="text-sm">
                                <span className="text-blue-700 font-medium">Next Meeting: </span>
                                <span className="text-blue-600">
                                    {new Date(group.nextMeeting.meetingdatetime).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <Button
                        variant="outline"
                        className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={onViewDetails}
                    >
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

// ===================== GROUP DETAILS MODAL =====================

function GroupDetailsModal({
    group,
    onClose,
    projectTypes,
    staffList,
    students = [],
}: {
    group: Group;
    onClose: () => void;
    projectTypes?: ProjectType[];
    staffList?: Staff[];
    students?: Student[];
}) {
    const [isPending, startTransition] = useTransition();
    const [isEditing, setIsEditing] = useState(false);
    const [isAddingStudent, setIsAddingStudent] = useState(false);
    const [newStudentId, setNewStudentId] = useState("");
    const [editData, setEditData] = useState({
        groupName: group.name,
        projectTitle: group.title || "",
        projectArea: group.area || "",
        projectDescription: group.description || "",
    });

    const leader = group.members.find((m) => m.isLeader);
    const regularMembers = group.members.filter((m) => !m.isLeader);

    const availableStudents = students.filter(s => !group.members.some(m => m.id === s.id));

    const handleDownloadPDF = () => {
        generateGroupReportPDF(group);
    };

    const handleSaveEdit = () => {
        startTransition(async () => {
            const result = await updateGroup({
                groupId: group.id,
                groupName: editData.groupName,
                projectTitle: editData.projectTitle || undefined,
                projectArea: editData.projectArea || undefined,
                projectDescription: editData.projectDescription || undefined,
            });

            if (result.success) {
                setIsEditing(false);
                onClose(); // Close to refresh data
            } else {
                alert(result.error || "Failed to update group");
            }
        });
    };

    const handleCompleteGroup = () => {
        if (!confirm("Are you sure you want to mark this project as completed?")) return;
        startTransition(async () => {
            const result = await markGroupComplete(group.id);
            if (result.success) {
                onClose();
            } else {
                alert(result.error || "Failed to complete group");
            }
        });
    };

    const handleDeleteGroup = () => {
        if (!confirm("WARNING: Are you sure you want to delete this group? This action cannot be undone.")) return;
        startTransition(async () => {
            const result = await deleteGroup(group.id);
            if (result.success) {
                onClose();
            } else {
                alert(result.error || "Failed to delete group");
            }
        });
    };

    const handleRemoveMember = (studentId: number | undefined) => {
        if (!studentId) return;
        if (!confirm("Are you sure you want to remove this member?")) return;
        startTransition(async () => {
            const result = await removeGroupMember({ groupId: group.id, studentId });
            if (result.success) {
                onClose();
            } else {
                alert(result.error || "Failed to remove member");
            }
        });
    };

    const handleAddMember = () => {
        if (!newStudentId) return;
        startTransition(async () => {
            const result = await addGroupMember({ groupId: group.id, studentId: parseInt(newStudentId) });
            if (result.success) {
                setIsAddingStudent(false);
                setNewStudentId("");
                onClose();
            } else {
                alert(result.error || "Failed to add member");
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-amber-50">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <FolderKanban className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                {isEditing ? (
                                    <Input
                                        value={editData.groupName}
                                        onChange={(e) => setEditData({ ...editData, groupName: e.target.value })}
                                        className="font-bold text-lg"
                                    />
                                ) : (
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {group.title || group.name}
                                    </h2>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    {group.projectType && (
                                        <Badge className="bg-emerald-100 text-emerald-700">
                                            {group.projectType}
                                        </Badge>
                                    )}
                                    {group.area && !isEditing && (
                                        <span className="text-sm text-slate-500 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />
                                            {group.area}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Edit Mode Fields */}
                    {isEditing && (
                        <div className="space-y-4 mb-6 p-4 bg-emerald-50 rounded-xl">
                            <div className="space-y-2">
                                <Label>Project Title</Label>
                                <Input
                                    value={editData.projectTitle}
                                    onChange={(e) => setEditData({ ...editData, projectTitle: e.target.value })}
                                    placeholder="Enter project title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Project Area</Label>
                                <Input
                                    value={editData.projectArea}
                                    onChange={(e) => setEditData({ ...editData, projectArea: e.target.value })}
                                    placeholder="e.g., Web Development, ML"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={editData.projectDescription}
                                    onChange={(e) => setEditData({ ...editData, projectDescription: e.target.value })}
                                    rows={3}
                                    placeholder="Project description..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Project Description */}
                    {!isEditing && group.description && (
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-slate-700 mb-2">Project Description</h3>
                            <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{group.description}</p>
                        </div>
                    )}

                    {/* Project Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-emerald-50 rounded-xl">
                            <p className="text-xs text-emerald-600 uppercase tracking-wide font-medium mb-1">Group Name</p>
                            <p className="font-semibold text-slate-900">{group.name}</p>
                        </div>
                        {group.averageCpi && (
                            <div className="p-4 bg-amber-50 rounded-xl">
                                <p className="text-xs text-amber-600 uppercase tracking-wide font-medium mb-1">Average CPI</p>
                                <p className="font-semibold text-slate-900">{group.averageCpi.toFixed(2)}</p>
                            </div>
                        )}
                    </div>

                    {/* Faculty Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {group.convener && (
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Convener</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{group.convener.staffname}</p>
                                        {group.convener.email && (
                                            <p className="text-sm text-slate-500">{group.convener.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {group.expert && (
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">Expert</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">{group.expert.staffname}</p>
                                        {group.expert.email && (
                                            <p className="text-sm text-slate-500">{group.expert.email}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Team Members */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Team Members ({group.members.length})
                            </h3>
                            {isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-emerald-600 border-emerald-200"
                                    onClick={() => setIsAddingStudent(!isAddingStudent)}
                                >
                                    <UserPlus className="h-3 w-3 mr-1" />
                                    Add Member
                                </Button>
                            )}
                        </div>

                        {isEditing && isAddingStudent && (
                            <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-end gap-3">
                                <div className="flex-1 space-y-2">
                                    <Label>Select Student to Add</Label>
                                    <Select value={newStudentId} onValueChange={setNewStudentId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Search student..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableStudents.map(student => (
                                                <SelectItem key={student.id} value={student.id.toString()}>
                                                    {student.name} ({student.email})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white" 
                                    onClick={handleAddMember}
                                    disabled={!newStudentId || isPending}
                                >
                                    Add
                                </Button>
                            </div>
                        )}

                        {/* Leader */}
                        {leader && (
                            <div className="mb-3">
                                <p className="text-xs text-amber-600 uppercase tracking-wide font-medium mb-2 flex items-center gap-1">
                                    <Crown className="h-3 w-3" />
                                    Group Leader
                                </p>
                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {leader.name?.charAt(0) || "?"}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-slate-900">{leader.name}</p>
                                                <Badge className="bg-amber-100 text-amber-700 text-xs">Leader</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-3 mt-1 text-sm text-slate-500">
                                                {leader.email && (
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {leader.email}
                                                    </span>
                                                )}
                                                {leader.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {leader.phone}
                                                    </span>
                                                )}
                                                {leader.cgpa !== null && (
                                                    <span className="text-emerald-600 font-medium">
                                                        CGPA: {leader.cgpa}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Other Members */}
                        {regularMembers.length > 0 && (
                            <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">
                                    Members
                                </p>
                                <div className="space-y-2">
                                    {regularMembers.map((member, index) => (
                                        <div
                                            key={member.id || index}
                                            className="p-3 bg-slate-50 rounded-lg flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                                                {member.name?.charAt(0) || "?"}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-900">{member.name}</p>
                                                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                                    {member.email && (
                                                        <span className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {member.email}
                                                        </span>
                                                    )}
                                                    {member.cgpa !== null && (
                                                        <span className="text-emerald-600 font-medium">
                                                            CGPA: {member.cgpa}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {isEditing && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Next Meeting */}
                    {group.nextMeeting && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                <span className="font-medium text-blue-900">Next Meeting</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-blue-600">Date & Time</p>
                                    <p className="font-medium text-slate-900">
                                        {new Date(group.nextMeeting.meetingdatetime).toLocaleString("en-IN", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>
                                {group.nextMeeting.meetinglocation && (
                                    <div>
                                        <p className="text-blue-600">Location</p>
                                        <p className="font-medium text-slate-900">{group.nextMeeting.meetinglocation}</p>
                                    </div>
                                )}
                            </div>
                            {group.nextMeeting.meetingpurpose && (
                                <div className="mt-2">
                                    <p className="text-blue-600 text-sm">Purpose</p>
                                    <p className="font-medium text-slate-900">{group.nextMeeting.meetingpurpose}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleDownloadPDF}>
                            <Download className="h-4 w-4 mr-2" />
                            PDF
                        </Button>
                        {isEditing && (
                            <Button 
                                variant="destructive" 
                                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                onClick={handleDeleteGroup} 
                                disabled={isPending}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Group
                            </Button>
                        )}
                        {!isEditing && group.status !== "Completed" && (
                            <Button 
                                variant="outline" 
                                className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200"
                                onClick={handleCompleteGroup} 
                                disabled={isPending}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Complete Project
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={handleSaveEdit}
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={onClose}>
                                    Close
                                </Button>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Group
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}


const STATIC_PROJECT_TYPES = [
    "Capstone Project",
    "Mini Project",
    "Research Thesis",
    "Industrial Internship",
    "Software Development",
    "Hardware Prototype",
    "Data Analytics Study",
    "Machine Learning Model",
    "Cybersecurity Audit",
    "Open Source Contribution"
];

// ===================== CREATE GROUP MODAL =====================

function CreateGroupModal({
    students,
    projectTypes,
    staffList,
    onClose,
}: {
    students: Student[];
    projectTypes: ProjectType[];
    staffList: Staff[];
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState(1);
    const [searchStudent, setSearchStudent] = useState("");

    // Form state
    const [groupName, setGroupName] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [projectArea, setProjectArea] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectTypeId, setProjectTypeId] = useState<string>("");
    const [expertStaffId, setExpertStaffId] = useState<string>("");
    const [selectedMembers, setSelectedMembers] = useState<{
        id: number;
        name: string;
        isLeader: boolean;
    }[]>([]);

    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
            s.email?.toLowerCase().includes(searchStudent.toLowerCase())
    );

    const toggleMember = (student: Student) => {
        const exists = selectedMembers.find((m) => m.id === student.id);
        if (exists) {
            setSelectedMembers(selectedMembers.filter((m) => m.id !== student.id));
        } else {
            setSelectedMembers([
                ...selectedMembers,
                { id: student.id, name: student.name, isLeader: false },
            ]);
        }
    };

    const toggleLeader = (studentId: number) => {
        setSelectedMembers(
            selectedMembers.map((m) => ({
                ...m,
                isLeader: m.id === studentId ? !m.isLeader : false, // Only one leader at a time
            }))
        );
    };

    const handleSubmit = () => {
        if (!groupName || !projectTypeId || selectedMembers.length === 0) {
            alert("Please fill in all required fields and select at least one member");
            return;
        }

        startTransition(async () => {
            const isNumeric = !isNaN(parseInt(projectTypeId, 10)) && /^\d+$/.test(projectTypeId);
            const result = await createGroup({
                groupName,
                projectTitle: projectTitle || undefined,
                projectArea: projectArea || undefined,
                projectDescription: projectDescription || undefined,
                projectTypeId: isNumeric ? parseInt(projectTypeId, 10) : undefined,
                projectTypeName: !isNumeric ? projectTypeId : undefined,
                expertStaffId: expertStaffId && expertStaffId !== "none" ? parseInt(expertStaffId) : undefined,
                members: selectedMembers.map((m) => ({
                    studentId: m.id,
                    isLeader: m.isLeader,
                })),
            });

            if (result.success) {
                onClose();
            } else {
                alert(result.error || "Failed to create group");
            }
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-emerald-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <UserPlus className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Create New Group</h2>
                                <p className="text-sm text-slate-500">
                                    Step {step} of 2: {step === 1 ? "Project Details" : "Select Members"}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex gap-2 mt-4">
                        <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 1 ? "bg-emerald-600" : "bg-slate-200"}`} />
                        <div className={`flex-1 h-1 rounded-full transition-colors ${step >= 2 ? "bg-emerald-600" : "bg-slate-200"}`} />
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-220px)]">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="groupName">Group Name *</Label>
                                    <Input
                                        id="groupName"
                                        placeholder="e.g., Team Alpha"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="projectType">Project Type *</Label>
                                    <Select value={projectTypeId} onValueChange={setProjectTypeId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent position="popper" className="z-[60]">
                                            {STATIC_PROJECT_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectTitle">Project Title</Label>
                                <Input
                                    id="projectTitle"
                                    placeholder="e.g., Student Management System"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectArea">Project Area / Domain</Label>
                                <Input
                                    id="projectArea"
                                    placeholder="e.g., Web Development, Machine Learning"
                                    value={projectArea}
                                    onChange={(e) => setProjectArea(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectDescription">Project Description</Label>
                                <Textarea
                                    id="projectDescription"
                                    placeholder="Brief description of the project..."
                                    rows={3}
                                    value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expertStaff">Expert (Optional)</Label>
                                <Select value={expertStaffId} onValueChange={setExpertStaffId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select expert faculty" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" className="z-[60]">
                                        <SelectItem value="none">No Expert</SelectItem>
                                        {staffList.map((staff) => (
                                            <SelectItem key={staff.id} value={staff.id.toString()}>
                                                {staff.name} {staff.email ? `(${staff.email})` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Selected Members */}
                            {selectedMembers.length > 0 && (
                                <div className="p-4 bg-emerald-50 rounded-xl mb-4">
                                    <p className="text-sm font-medium text-emerald-700 mb-2">
                                        Selected Members ({selectedMembers.length})
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMembers.map((member) => (
                                            <Badge
                                                key={member.id}
                                                className={`${member.isLeader
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-white text-slate-700"
                                                    } flex items-center gap-1 pr-1`}
                                            >
                                                {member.isLeader && <Crown className="h-3 w-3" />}
                                                {member.name}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-4 w-4 ml-1 hover:bg-red-100"
                                                    onClick={() => toggleMember({ id: member.id, name: member.name } as Student)}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Search Students */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search students by name or email..."
                                    value={searchStudent}
                                    onChange={(e) => setSearchStudent(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Students List */}
                            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map((student) => {
                                        const isSelected = selectedMembers.some((m) => m.id === student.id);
                                        const member = selectedMembers.find((m) => m.id === student.id);

                                        return (
                                            <div
                                                key={student.id}
                                                className={`p-3 border-b border-slate-100 last:border-b-0 flex items-center gap-3 hover:bg-slate-50 transition-colors ${isSelected ? "bg-emerald-50" : ""
                                                    }`}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleMember(student)}
                                                />
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-slate-900">{student.name}</p>
                                                        {student.isInGroup && (
                                                            <Badge variant="outline" className="text-xs text-slate-500">
                                                                In {student.groupCount} group(s)
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-500">{student.email}</p>
                                                </div>
                                                {isSelected && (
                                                    <Button
                                                        variant={member?.isLeader ? "default" : "outline"}
                                                        size="sm"
                                                        className={member?.isLeader ? "bg-amber-500 hover:bg-amber-600" : ""}
                                                        onClick={() => toggleLeader(student.id)}
                                                    >
                                                        <Crown className="h-3 w-3 mr-1" />
                                                        {member?.isLeader ? "Leader" : "Set Leader"}
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        No students found
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>
                            Back
                        </Button>
                    ) : (
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    )}

                    {step < 2 ? (
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => setStep(2)}
                            disabled={!groupName || !projectTypeId}
                        >
                            Next: Select Members
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleSubmit}
                            disabled={isPending || selectedMembers.length === 0}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Create Group
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ===================== EMPTY STATE =====================

function EmptyState({ onCreateGroup }: { onCreateGroup: () => void }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="inline-block mb-6"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-200 rounded-2xl blur-xl opacity-40" />
                    <div className="relative bg-amber-50 border border-amber-100 p-8 rounded-2xl">
                        <Users className="h-16 w-16 text-amber-400 mx-auto" />
                    </div>
                </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Groups Yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                You haven&apos;t been assigned any student groups yet. Create a new group or wait for
                assignments.
            </p>
            <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={onCreateGroup}
            >
                <Plus className="h-4 w-4 mr-2" />
                Create New Group
            </Button>
        </div>
    );
}
