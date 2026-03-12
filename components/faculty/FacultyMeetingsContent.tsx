// /components/faculty/FacultyMeetingsContent.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Plus,
    Search,
    Filter,
    ChevronRight,
    CheckCircle2,
    Star,
    AlertCircle,
    Video,
    FileText,
    CalendarPlus,
    X,
    Loader2,
    Download,
    Send,
    ClipboardCheck,
    User,
    Pencil,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useState, useTransition } from "react";
import { createMeeting, completeMeetingReview, saveAttendance, updateMeeting, deleteMeeting } from "@/app/actions/getFacultyData";
import { generateMeetingReportPDF, generateMeetingAttendancePDF } from "@/lib/pdfGenerator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Attendee {
    studentId: number | undefined;
    name: string | undefined;
    present: boolean | null;
    remarks: string | null;
}

interface Meeting {
    id: number;
    datetime: Date;
    purpose: string | null;
    location: string | null;
    status: string | null;
    notes: string | null;
    grade: string | null;
    groupId: number | undefined;
    groupName: string | undefined;
    projectTitle: string | null | undefined;
    attendees: Attendee[];
}

interface Group {
    id: number;
    name: string;
    title: string | null;
    memberCount: number;
}

interface FacultyMeetingsContentProps {
    meetings: {
        upcoming: Meeting[];
        past: Meeting[];
    };
    groups: Group[];
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

export function FacultyMeetingsContent({ meetings, groups }: FacultyMeetingsContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

    const filterMeetings = (meetingList: Meeting[]) =>
        meetingList.filter(
            (meeting) =>
                meeting.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                meeting.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const filteredUpcoming = filterMeetings(meetings.upcoming);
    const filteredPast = filterMeetings(meetings.past);

    const meetingStats = [
        {
            label: "Upcoming",
            count: meetings.upcoming.length,
            color: "emerald",
            icon: CalendarPlus,
        },
        {
            label: "This Week",
            count: meetings.upcoming.filter(
                (m) =>
                    new Date(m.datetime) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            ).length,
            color: "emerald",
            icon: Clock,
        },
        {
            label: "Completed",
            count: meetings.past.filter(m => m.status === "Completed").length,
            color: "slate",
            icon: CheckCircle2,
        },
    ];

    const handleExportPDF = () => {
        const allMeetings = [...meetings.upcoming, ...meetings.past];
        generateMeetingReportPDF(allMeetings, "All Meetings Report");
    };

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
                            Meetings
                        </h1>
                        <p className="text-slate-500">Schedule and manage student meetings</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="border-slate-200"
                            onClick={handleExportPDF}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export PDF
                        </Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                            onClick={() => setShowScheduleModal(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Schedule Meeting
                        </Button>
                    </div>
                </motion.div>

                {/* Meeting Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
                >
                    {meetingStats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            whileHover={{ y: -2 }}
                            className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${stat.color === "emerald"
                                ? "border-emerald-100"
                                : stat.color === "emerald"
                                    ? "border-emerald-100"
                                    : "border-slate-200"
                                }`}
                        >
                            <div
                                className={`p-3 rounded-xl ${stat.color === "emerald"
                                    ? "bg-emerald-100"
                                    : stat.color === "emerald"
                                        ? "bg-emerald-100"
                                        : "bg-slate-100"
                                    }`}
                            >
                                <stat.icon
                                    className={`h-5 w-5 ${stat.color === "emerald"
                                        ? "text-emerald-600"
                                        : stat.color === "emerald"
                                            ? "text-emerald-600"
                                            : "text-slate-600"
                                        }`}
                                />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search */}
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
                                placeholder="Search meetings..."
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

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Tabs defaultValue="upcoming" className="w-full">
                        <TabsList className="bg-white border border-slate-200 p-1 mb-6">
                            <TabsTrigger
                                value="upcoming"
                                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                            >
                                <CalendarPlus className="h-4 w-4 mr-2" />
                                Upcoming ({filteredUpcoming.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="past"
                                className="data-[state=active]:bg-slate-100 data-[state=active]:text-slate-700"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Past ({filteredPast.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming">
                            {filteredUpcoming.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-4"
                                >
                                    {filteredUpcoming.map((meeting) => (
                                        <MeetingCard
                                            key={meeting.id}
                                            meeting={meeting}
                                            type="upcoming"
                                            onViewDetails={() => setSelectedMeeting(meeting)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState type="upcoming" onSchedule={() => setShowScheduleModal(true)} />
                            )}
                        </TabsContent>

                        <TabsContent value="past">
                            {filteredPast.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-4"
                                >
                                    {filteredPast.map((meeting) => (
                                        <MeetingCard
                                            key={meeting.id}
                                            meeting={meeting}
                                            type="past"
                                            onViewDetails={() => setSelectedMeeting(meeting)}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState type="past" />
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* Schedule Meeting Modal */}
            <AnimatePresence>
                {showScheduleModal && (
                    <ScheduleMeetingModal
                        groups={groups}
                        onClose={() => {
                            setShowScheduleModal(false);
                            window.location.reload();
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Meeting Details Modal */}
            <AnimatePresence>
                {selectedMeeting && (
                    <MeetingDetailsModal
                        meeting={selectedMeeting}
                        onClose={() => {
                            setSelectedMeeting(null);
                            window.location.reload();
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ===================== MEETING CARD =====================

function MeetingCard({
    meeting,
    type,
    onViewDetails
}: {
    meeting: Meeting;
    type: "upcoming" | "past";
    onViewDetails: () => void;
}) {
    const meetingDate = new Date(meeting.datetime);
    const isToday = meetingDate.toDateString() === new Date().toDateString();
    const isTomorrow = meetingDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

    const getStatusBadge = () => {
        if (type === "upcoming") {
            if (isToday) return <Badge className="bg-red-100 text-red-700">Today</Badge>;
            if (isTomorrow) return <Badge className="bg-orange-100 text-orange-700">Tomorrow</Badge>;
            return <Badge className="bg-emerald-100 text-emerald-700">Scheduled</Badge>;
        }
        return meeting.status === "Completed"
            ? <Badge className="bg-slate-100 text-slate-700">Completed</Badge>
            : <Badge className="bg-amber-100 text-amber-700">Pending Review</Badge>;
    };

    return (
        <motion.div variants={itemVariants}>
            <div className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${isToday ? "border-red-200 bg-red-50/30" : "border-slate-200"
                }`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Date */}
                    <div className="flex items-center gap-4 md:w-32">
                        <div className={`p-3 rounded-xl ${type === "upcoming" ? "bg-emerald-100" : "bg-slate-100"
                            }`}>
                            <Calendar className={`h-5 w-5 ${type === "upcoming" ? "text-emerald-600" : "text-slate-600"
                                }`} />
                        </div>
                        <div className="md:hidden">
                            <p className="font-semibold text-slate-900">
                                {meetingDate.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </p>
                            <p className="text-sm text-slate-500">
                                {meetingDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>

                    <div className="hidden md:block text-center w-20">
                        <p className="text-2xl font-bold text-slate-900">
                            {meetingDate.getDate()}
                        </p>
                        <p className="text-sm text-slate-500">
                            {meetingDate.toLocaleDateString("en-IN", { month: "short" })}
                        </p>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-semibold text-slate-900">
                                {meeting.purpose || "Meeting"}
                            </h3>
                            {getStatusBadge()}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meeting.groupName}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meetingDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {meeting.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {meeting.location}
                                </span>
                            )}
                            {meeting.attendees.length > 0 && (
                                <span className="flex items-center gap-1">
                                    <ClipboardCheck className="h-3 w-3" />
                                    {meeting.attendees.filter(a => a.present).length}/{meeting.attendees.length} present
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                            onClick={onViewDetails}
                        >
                            {type === "upcoming" ? "View" : "Details"}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ===================== SCHEDULE MEETING MODAL =====================

function ScheduleMeetingModal({
    groups,
    onClose
}: {
    groups: Group[];
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [selectedGroup, setSelectedGroup] = useState("");
    const [purpose, setPurpose] = useState("");
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [sendNotification, setSendNotification] = useState(true);

    const handleSubmit = () => {
        if (!selectedGroup || !purpose || !date || !time) {
            alert("Please fill in all required fields");
            return;
        }

        const dateString = format(date, "yyyy-MM-dd");
        const datetime = new Date(`${dateString}T${time}`);

        startTransition(async () => {
            const result = await createMeeting({
                groupId: parseInt(selectedGroup),
                datetime,
                purpose,
                location: location || undefined,
                description: description || undefined,
                sendNotification,
            });

            if (result.success) {
                onClose();
            } else {
                alert(result.error || "Failed to schedule meeting");
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
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <CalendarPlus className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Schedule Meeting</h2>
                                <p className="text-sm text-slate-500">Create a new meeting with your group</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="group">Select Group *</Label>
                            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.map((group) => (
                                        <SelectItem key={group.id} value={group.id.toString()}>
                                            {group.name} - {group.title || "No title"}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purpose">Meeting Purpose *</Label>
                            <Input
                                id="purpose"
                                placeholder="e.g., Project Review, Progress Update"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal border-slate-200",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Select Date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                            className="border-none rounded-xl"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 pointer-events-none" />
                                    <Input
                                        id="time"
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="pl-10 cursor-pointer text-slate-700 bg-white border-slate-200 focus:bg-white focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="e.g., Room 101, Online via Google Meet"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Additional Notes</Label>
                            <Textarea
                                id="description"
                                placeholder="Any additional details..."
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                            <Checkbox
                                id="notification"
                                checked={sendNotification}
                                onCheckedChange={(checked) => setSendNotification(checked === true)}
                            />
                            <div>
                                <Label htmlFor="notification" className="font-medium text-emerald-700 cursor-pointer">
                                    Send Email Notification
                                </Label>
                                <p className="text-xs text-emerald-600">
                                    Notify all group members via email about this meeting
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-end">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={handleSubmit}
                        disabled={isPending || !selectedGroup || !purpose || !date || !time}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Scheduling...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Schedule Meeting
                            </>
                        )}
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ===================== MEETING DETAILS MODAL =====================

function MeetingDetailsModal({
    meeting,
    onClose
}: {
    meeting: Meeting;
    onClose: () => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [isSavingAttendance, startSaveTransition] = useTransition();
    const [notes, setNotes] = useState(meeting.notes || "");
    const [grade, setGrade] = useState(meeting.grade || "");
    const [attendanceSaved, setAttendanceSaved] = useState(false);
    const [attendance, setAttendance] = useState<{ [key: number]: { present: boolean; remarks: string } }>(
        meeting.attendees.reduce((acc, a) => {
            if (a.studentId) {
                acc[a.studentId] = {
                    present: a.present || false,
                    remarks: a.remarks || "",
                };
            }
            return acc;
        }, {} as { [key: number]: { present: boolean; remarks: string } })
    );

    const meetingDate = new Date(meeting.datetime);
    const isPast = meetingDate < new Date();
    const needsReview = isPast && meeting.status !== "Completed";
    const isCompleted = meeting.status === "Completed";
    
    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingReview, setIsEditingReview] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editPurpose, setEditPurpose] = useState(meeting.purpose || "");
    const [editDate, setEditDate] = useState<Date | undefined>(meetingDate);
    const [editTime, setEditTime] = useState(
        meetingDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
    const [editLocation, setEditLocation] = useState(meeting.location || "");
    const [sendNotification, setSendNotification] = useState(true);

    const handleSaveEdits = () => {
        if (!editDate || !editTime || !editPurpose) return;
        const dateString = format(editDate, "yyyy-MM-dd");
        const datetime = new Date(`${dateString}T${editTime}`);

        startTransition(async () => {
            const result = await updateMeeting({
                meetingId: meeting.id,
                datetime,
                purpose: editPurpose,
                location: editLocation,
                sendNotification,
            });
            if (result.success) {
                onClose();
            } else {
                alert(result.error);
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this meeting?")) return;
        setIsDeleting(true);
        startTransition(async () => {
             const result = await deleteMeeting(meeting.id);
             setIsDeleting(false);
             if (result.success) {
                 onClose();
             } else {
                 alert(result.error);
             }
        });
    };

    // Attendance stats
    const totalStudents = meeting.attendees.length;
    const presentCount = Object.values(attendance).filter(a => a.present).length;
    const absentCount = totalStudents - presentCount;

    const handleDownloadPDF = () => {
        generateMeetingAttendancePDF(meeting);
    };

    const handleSaveAttendance = () => {
        startSaveTransition(async () => {
            const result = await saveAttendance({
                meetingId: meeting.id,
                attendance: Object.entries(attendance).map(([studentId, data]) => ({
                    studentId: parseInt(studentId),
                    present: data.present,
                    remarks: data.remarks || undefined,
                })),
            });

            if (result.success) {
                setAttendanceSaved(true);
                setTimeout(() => setAttendanceSaved(false), 3000);
            } else {
                alert(result.error || "Failed to save attendance");
            }
        });
    };

    const handleSubmitReview = () => {
        startTransition(async () => {
            const result = await completeMeetingReview({
                meetingId: meeting.id,
                notes,
                grade: grade || undefined,
                attendance: Object.entries(attendance).map(([studentId, data]) => ({
                    studentId: parseInt(studentId),
                    present: data.present,
                    remarks: data.remarks || undefined,
                })),
            });

            if (result.success) {
                if (isEditingReview) setIsEditingReview(false);
                else onClose();
            } else {
                alert("Failed to submit review");
            }
        });
    };

    const toggleAttendance = (studentId: number) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                present: !prev[studentId]?.present,
            },
        }));
    };

    const updateRemarks = (studentId: number, remarks: string) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                remarks,
            },
        }));
    };

    const markAllPresent = () => {
        const newAttendance: typeof attendance = {};
        meeting.attendees.forEach(a => {
            if (a.studentId) {
                newAttendance[a.studentId] = {
                    present: true,
                    remarks: attendance[a.studentId]?.remarks || "",
                };
            }
        });
        setAttendance(newAttendance);
    };

    const markAllAbsent = () => {
        const newAttendance: typeof attendance = {};
        meeting.attendees.forEach(a => {
            if (a.studentId) {
                newAttendance[a.studentId] = {
                    present: false,
                    remarks: attendance[a.studentId]?.remarks || "",
                };
            }
        });
        setAttendance(newAttendance);
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
                <div className={`p-6 border-b border-slate-100 ${needsReview
                        ? "bg-gradient-to-r from-amber-50 to-orange-50"
                        : "bg-gradient-to-r from-emerald-50 to-teal-50"
                    }`}>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm">
                                <Calendar className={`h-6 w-6 ${needsReview ? "text-amber-600" : "text-emerald-600"}`} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    {meeting.purpose || "Meeting Details"}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className={needsReview ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}>
                                        {meeting.status || "Scheduled"}
                                    </Badge>
                                    <span className="text-sm text-slate-500">
                                        {meeting.groupName}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEditing && !isEditingReview && (
                                <Button variant="ghost" size="icon" onClick={() => {
                                    if (isCompleted) setIsEditingReview(true);
                                    else setIsEditing(true);
                                }}>
                                    <Pencil className="h-4 w-4 text-slate-500 hover:text-emerald-600" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Meeting Info */}
                    {isEditing ? (
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <Label>Purpose *</Label>
                                <Input value={editPurpose} onChange={e => setEditPurpose(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal border-slate-200",
                                                    !editDate && "text-muted-foreground"
                                                )}
                                            >
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {editDate ? format(editDate, "PPP") : <span>Select Date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CalendarComponent
                                                mode="single"
                                                selected={editDate}
                                                onSelect={setEditDate}
                                                initialFocus
                                                className="border-none rounded-xl"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label>Time *</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-600 pointer-events-none" />
                                        <Input
                                            type="time"
                                            value={editTime}
                                            onChange={(e) => setEditTime(e.target.value)}
                                            className="pl-10 cursor-pointer text-slate-700 bg-white border-slate-200 focus:bg-white focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input value={editLocation} onChange={e => setEditLocation(e.target.value)} />
                            </div>
                             <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                                <Checkbox
                                    id="edit-notification"
                                    checked={sendNotification}
                                    onCheckedChange={(checked) => setSendNotification(checked === true)}
                                />
                                <div>
                                    <Label htmlFor="edit-notification" className="font-medium text-emerald-700 cursor-pointer">
                                        Send Update Email
                                    </Label>
                                    <p className="text-xs text-emerald-600">
                                        Notify students about the updated details
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Date & Time</p>
                                <p className="font-semibold text-slate-900">
                                    {meetingDate.toLocaleDateString("en-IN", { dateStyle: "full" })}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {meetingDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Location</p>
                                <p className="font-semibold text-slate-900">
                                    {meeting.location || "Not specified"}
                                </p>
                            </div>
                        </div>
                    )}

                    {meeting.projectTitle && (
                        <div className="mb-6 p-4 bg-emerald-50 rounded-xl">
                            <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Project</p>
                            <p className="font-semibold text-emerald-900">{meeting.projectTitle}</p>
                        </div>
                    )}

                    {/* Attendance Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Attendance ({totalStudents} members)
                            </h3>
                            {!isCompleted && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                        onClick={markAllPresent}
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        All Present
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7 border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={markAllAbsent}
                                    >
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        All Absent
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Attendance Stats Bar */}
                        {totalStudents > 0 && (
                            <div className="mb-3 p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                                    <span>Present: {presentCount}/{totalStudents}</span>
                                    <span>Absent: {absentCount}/{totalStudents}</span>
                                    <span>{totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                        style={{ width: `${totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            {meeting.attendees.map((attendee, index) => (
                                <div
                                    key={attendee.studentId || index}
                                    className={`p-3 rounded-lg ${isCompleted
                                            ? attendee.present ? "bg-emerald-50" : "bg-red-50"
                                            : attendance[attendee.studentId!]?.present ? "bg-emerald-50/70" : "bg-slate-50"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                                                {attendee.name?.charAt(0) || "?"}
                                            </div>
                                            <span className="font-medium text-slate-900">{attendee.name}</span>
                                        </div>
                                        {(!isCompleted || isEditingReview) && attendee.studentId ? (
                                            <Button
                                                variant={attendance[attendee.studentId]?.present ? "default" : "outline"}
                                                size="sm"
                                                className={attendance[attendee.studentId]?.present
                                                    ? "bg-emerald-500 hover:bg-emerald-600"
                                                    : "border-slate-200 hover:border-red-200 hover:text-red-600"
                                                }
                                                onClick={() => toggleAttendance(attendee.studentId!)}
                                            >
                                                {attendance[attendee.studentId]?.present ? (
                                                    <><CheckCircle2 className="h-3 w-3 mr-1" /> Present</>
                                                ) : (
                                                    <><AlertCircle className="h-3 w-3 mr-1" /> Absent</>
                                                )}
                                            </Button>
                                        ) : (
                                            <Badge className={attendee.present ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                                                {attendee.present ? "Present" : "Absent"}
                                            </Badge>
                                        )}
                                    </div>
                                    {/* Remarks field */}
                                    {(!isCompleted || isEditingReview) && attendee.studentId ? (
                                        <div className="mt-2 ml-11">
                                            <Input
                                                placeholder="Add remarks (optional)..."
                                                className="h-7 text-xs bg-white/70 border-slate-200"
                                                value={attendance[attendee.studentId]?.remarks || ""}
                                                onChange={(e) => updateRemarks(attendee.studentId!, e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        attendee.remarks && (
                                            <div className="mt-1 ml-11">
                                                <p className="text-xs text-slate-500 italic">{attendee.remarks}</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                            {meeting.attendees.length === 0 && (
                                <div className="p-6 text-center text-slate-400">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No students in this group</p>
                                </div>
                            )}
                        </div>

                        {/* Save Attendance Button (for non-completed meetings) */}
                        {!isCompleted && meeting.attendees.length > 0 && (
                            <div className="mt-3">
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={handleSaveAttendance}
                                    disabled={isSavingAttendance}
                                    size="sm"
                                >
                                    {isSavingAttendance ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving Attendance...
                                        </>
                                    ) : attendanceSaved ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Attendance Saved!
                                        </>
                                    ) : (
                                        <>
                                            <ClipboardCheck className="h-4 w-4 mr-2" />
                                            Save Attendance
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Notes and Grade Section */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                        <div>
                            <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4" />
                            Meeting Notes
                        </Label>
                        {(needsReview || isEditingReview) ? (
                            <Textarea
                                id="notes"
                                placeholder="Add your meeting notes here..."
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="resize-none"
                            />
                        ) : (
                            <div className="p-4 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-wrap border border-slate-100">
                                {meeting.notes || "No notes available"}
                            </div>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="grade" className="flex items-center gap-2 mb-2 border-slate-700">
                            <Star className="h-4 w-4 text-amber-500" />
                            Grade / Score
                        </Label>
                        {(needsReview || isEditingReview) ? (
                            <Select value={grade} onValueChange={setGrade}>
                                <SelectTrigger id="grade" className="h-10">
                                    <SelectValue placeholder="Select Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Grade A</SelectItem>
                                    <SelectItem value="B">Grade B</SelectItem>
                                    <SelectItem value="C">Grade C</SelectItem>
                                    <SelectItem value="D">Grade D</SelectItem>
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                                {meeting.grade || "No Grade"}
                            </div>
                        )}
                        {(needsReview || isEditingReview) && (
                                <p className="text-xs text-slate-500 mt-2">
                                    Track continuous progress at this review step.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3 justify-between flex-wrap">
                    {isEditing ? (
                        <>
                            <div className="flex gap-2">
                                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting || isPending}>
                                    {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                                    Delete Meeting
                                </Button>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSaveEdits} disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                            </Button>
                            <div className="flex gap-3">
                                {isEditingReview ? (
                                    <>
                                        <Button variant="outline" onClick={() => setIsEditingReview(false)}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={handleSubmitReview}
                                            disabled={isPending}
                                        >
                                            {isPending ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <ClipboardCheck className="h-4 w-4 mr-2" />
                                                    Update Review
                                                </>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button variant="outline" onClick={onClose}>
                                            Close
                                        </Button>
                                        {needsReview && (
                                            <Button
                                                className="bg-amber-500 hover:bg-amber-600 text-white"
                                                onClick={handleSubmitReview}
                                                disabled={isPending}
                                            >
                                                {isPending ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ClipboardCheck className="h-4 w-4 mr-2" />
                                                        Complete Review
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ===================== EMPTY STATE =====================

function EmptyState({ type, onSchedule }: { type: "upcoming" | "past"; onSchedule?: () => void }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
            >
                <div className="relative">
                    <div className={`absolute inset-0 ${type === "upcoming" ? "bg-emerald-200" : "bg-slate-200"} rounded-2xl blur-xl opacity-40`} />
                    <div className={`relative ${type === "upcoming" ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-100"} border p-8 rounded-2xl`}>
                        {type === "upcoming" ? (
                            <CalendarPlus className="h-16 w-16 text-emerald-400 mx-auto" />
                        ) : (
                            <CheckCircle2 className="h-16 w-16 text-slate-400 mx-auto" />
                        )}
                    </div>
                </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {type === "upcoming" ? "No Upcoming Meetings" : "No Past Meetings"}
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {type === "upcoming"
                    ? "You don't have any upcoming meetings scheduled. Schedule a meeting with your student groups."
                    : "No meetings have been completed yet. Your past meetings will appear here."}
            </p>
            {type === "upcoming" && onSchedule && (
                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={onSchedule}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                </Button>
            )}
        </div>
    );
}
