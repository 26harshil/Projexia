// /components/faculty/FacultyReviewsContent.tsx
"use client";

import { motion } from "framer-motion";
import {
    ClipboardCheck,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    Star,
    ChevronRight,
    Users,
    Calendar,
    FileText,
    Edit3,
    MapPin,
    Loader2,
    X,
    UserCheck,
    UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { completeMeetingReview } from "@/app/actions/getFacultyData";
import { useRouter } from "next/navigation";

interface ReviewAttendee {
    studentId: number | undefined;
    name: string | undefined;
    present: boolean | null;
    remarks: string | null;
}

interface PendingReview {
    id: number;
    datetime: Date;
    purpose: string | null;
    location: string | null;
    groupId: number | undefined;
    groupName: string | undefined;
    projectTitle: string | null | undefined;
    attendees: ReviewAttendee[];
    attendeeCount: number;
    presentCount: number;
}

interface CompletedReview {
    id: number;
    datetime: Date;
    purpose: string | null;
    groupId: number | undefined;
    groupName: string | undefined;
    projectTitle: string | null | undefined;
    notes: string | null;
    grade: string | null;
}

interface FacultyReviewsContentProps {
    reviews: {
        pending: PendingReview[];
        completed: CompletedReview[];
    };
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

export function FacultyReviewsContent({ reviews }: FacultyReviewsContentProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [detailsReview, setDetailsReview] = useState<CompletedReview | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const router = useRouter();

    const filterPending = (list: PendingReview[]) =>
        list.filter(
            (r) =>
                r.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const filterCompleted = (list: CompletedReview[]) =>
        list.filter(
            (r) =>
                r.purpose?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const filteredPending = filterPending(reviews.pending);
    const filteredCompleted = filterCompleted(reviews.completed);

    const reviewStats = [
        {
            label: "Pending",
            count: reviews.pending.length,
            color: "amber",
            icon: Clock,
        },
        {
            label: "In Progress",
            count: 0,
            color: "emerald",
            icon: AlertCircle,
        },
        {
            label: "Completed",
            count: reviews.completed.length,
            color: "emerald",
            icon: CheckCircle2,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                        Project Reviews
                    </h1>
                    <p className="text-slate-500">
                        Review and grade student project submissions
                    </p>
                </motion.div>

                {/* Review Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
                >
                    {reviewStats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            whileHover={{ y: -2 }}
                            className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${stat.color === "amber"
                                ? "border-amber-100"
                                : stat.color === "emerald"
                                    ? "border-emerald-100"
                                    : "border-emerald-100"
                                }`}
                        >
                            <div
                                className={`p-3 rounded-xl ${stat.color === "amber"
                                    ? "bg-amber-100"
                                    : stat.color === "emerald"
                                        ? "bg-emerald-100"
                                        : "bg-emerald-100"
                                    }`}
                            >
                                <stat.icon
                                    className={`h-5 w-5 ${stat.color === "amber"
                                        ? "text-amber-600"
                                        : stat.color === "emerald"
                                            ? "text-emerald-600"
                                            : "text-emerald-600"
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

                {/* Search and Filters */}
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
                                placeholder="Search reviews..."
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

                {/* Reviews Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="bg-white border border-slate-200 p-1 mb-6">
                            <TabsTrigger
                                value="pending"
                                className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                Pending ({filteredPending.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="completed"
                                className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700"
                            >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Completed ({filteredCompleted.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                            {filteredPending.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-4"
                                >
                                    {filteredPending.map((review) => (
                                        <PendingReviewCard
                                            key={review.id}
                                            review={review}
                                            onReviewNow={() => {
                                                setSelectedReview(review);
                                                setReviewDialogOpen(true);
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState type="pending" />
                            )}
                        </TabsContent>

                        <TabsContent value="completed">
                            {filteredCompleted.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="space-y-4"
                                >
                                    {filteredCompleted.map((review) => (
                                        <CompletedReviewCard
                                            key={review.id}
                                            review={review}
                                            onViewDetails={() => {
                                                setDetailsReview(review);
                                                setDetailsDialogOpen(true);
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState type="completed" />
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* Review Now Dialog */}
            {selectedReview && (
                <ReviewDialog
                    review={selectedReview}
                    open={reviewDialogOpen}
                    onOpenChange={(open) => {
                        setReviewDialogOpen(open);
                        if (!open) setSelectedReview(null);
                    }}
                    onSuccess={() => {
                        setReviewDialogOpen(false);
                        setSelectedReview(null);
                        router.refresh();
                    }}
                />
            )}

            {/* View Details Dialog */}
            {detailsReview && (
                <DetailsDialog
                    review={detailsReview}
                    open={detailsDialogOpen}
                    onOpenChange={(open) => {
                        setDetailsDialogOpen(open);
                        if (!open) setDetailsReview(null);
                    }}
                />
            )}
        </div>
    );
}

function PendingReviewCard({ review, onReviewNow }: { review: PendingReview; onReviewNow: () => void }) {
    const reviewDate = new Date(review.datetime);
    const daysSince = Math.floor(
        (Date.now() - reviewDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isUrgent = daysSince > 3;

    return (
        <motion.div variants={itemVariants}>
            <div
                className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all ${isUrgent
                    ? "border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-white"
                    : "border-amber-200 bg-gradient-to-r from-amber-50/50 to-white"
                    }`}
            >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Urgency Indicator */}
                    <div
                        className={`shrink-0 text-center p-3 rounded-xl ${isUrgent ? "bg-emerald-100" : "bg-amber-100"
                            }`}
                    >
                        <Clock
                            className={`h-6 w-6 mx-auto ${isUrgent ? "text-emerald-600" : "text-amber-600"
                                }`}
                        />
                        <p
                            className={`text-xs font-medium mt-1 ${isUrgent ? "text-emerald-600" : "text-amber-600"
                                }`}
                        >
                            {daysSince === 0
                                ? "Today"
                                : daysSince === 1
                                    ? "1 day ago"
                                    : `${daysSince} days ago`}
                        </p>
                    </div>

                    {/* Review Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-slate-900">
                                {review.purpose || "Meeting Review"}
                            </h3>
                            {isUrgent && (
                                <Badge className="bg-emerald-600 text-white text-xs">Urgent</Badge>
                            )}
                        </div>
                        <p className="text-sm text-emerald-600 font-medium mb-2">
                            {review.groupName || review.projectTitle}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {reviewDate.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {review.presentCount}/{review.attendeeCount} present
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            size="sm"
                            onClick={onReviewNow}
                        >
                            <Edit3 className="h-4 w-4 mr-1" />
                            Review Now
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function CompletedReviewCard({ review, onViewDetails }: { review: CompletedReview; onViewDetails: () => void }) {
    const reviewDate = new Date(review.datetime);

    return (
        <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Completed Indicator */}
                    <div className="shrink-0 text-center p-3 rounded-xl bg-emerald-100 flex flex-col items-center justify-center gap-1 min-w-[70px]">
                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                        {review.grade && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-200/50 px-2 py-0.5 rounded-full mt-1">
                                {review.grade}
                            </span>
                        )}
                    </div>

                    {/* Review Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-slate-900">
                                {review.purpose || "Meeting Review"}
                            </h3>
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                                Completed
                            </Badge>
                        </div>
                        <p className="text-sm text-emerald-600 font-medium mb-2">
                            {review.groupName || review.projectTitle}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {reviewDate.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        {review.notes && (
                            <p className="text-sm text-slate-600 mt-2 line-clamp-2 italic">
                                &quot;{review.notes}&quot;
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="border-slate-200" onClick={onViewDetails}>
                            <FileText className="h-4 w-4 mr-1" />
                            View Details
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState({ type }: { type: "pending" | "completed" }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-block mb-6"
            >
                <div className="relative">
                    <div
                        className={`absolute inset-0 rounded-2xl blur-xl opacity-40 ${type === "pending" ? "bg-amber-200" : "bg-emerald-200"
                            }`}
                    />
                    <div
                        className={`relative border p-8 rounded-2xl ${type === "pending"
                            ? "bg-amber-50 border-amber-100"
                            : "bg-emerald-50 border-emerald-100"
                            }`}
                    >
                        <ClipboardCheck
                            className={`h-16 w-16 mx-auto ${type === "pending" ? "text-amber-400" : "text-emerald-400"
                                }`}
                        />
                    </div>
                </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {type === "pending" ? "No Pending Reviews" : "No Completed Reviews"}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
                {type === "pending"
                    ? "All caught up! There are no project submissions waiting for your review."
                    : "Your completed reviews will appear here."}
            </p>
        </div>
    );
}

// ============== Review Dialog (for completing a pending review) ==============

function ReviewDialog({
    review,
    open,
    onOpenChange,
    onSuccess,
}: {
    review: PendingReview;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [notes, setNotes] = useState("");
    const [grade, setGrade] = useState("");
    const [attendance, setAttendance] = useState<
        { studentId: number; name: string; present: boolean; remarks: string }[]
    >(
        review.attendees.map((a) => ({
            studentId: a.studentId ?? 0,
            name: a.name ?? "Unknown",
            present: a.present ?? true,
            remarks: a.remarks ?? "",
        }))
    );
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const toggleAttendance = (index: number) => {
        setAttendance((prev) =>
            prev.map((a, i) => (i === index ? { ...a, present: !a.present } : a))
        );
    };

    const updateRemarks = (index: number, remarks: string) => {
        setAttendance((prev) =>
            prev.map((a, i) => (i === index ? { ...a, remarks } : a))
        );
    };

    const handleSubmit = () => {
        if (!notes.trim()) {
            setError("Please add review notes before submitting.");
            return;
        }
        setError(null);

        startTransition(async () => {
            try {
                const result = await completeMeetingReview({
                    meetingId: review.id,
                    notes: notes.trim(),
                    grade: grade.trim() || undefined,
                    attendance: attendance.map((a) => ({
                        studentId: a.studentId,
                        present: a.present,
                        remarks: a.remarks || undefined,
                    })),
                });

                if (result.success) {
                    onSuccess();
                } else {
                    setError("Failed to submit review. Please try again.");
                }
            } catch {
                setError("An error occurred while submitting the review.");
            }
        });
    };

    const reviewDate = new Date(review.datetime);
    const presentCount = attendance.filter((a) => a.present).length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Edit3 className="h-5 w-5 text-amber-600" />
                        Complete Review
                    </DialogTitle>
                    <DialogDescription>
                        Review meeting for{" "}
                        <span className="font-medium text-slate-900">
                            {review.groupName}
                        </span>{" "}
                        &mdash;{" "}
                        {reviewDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Meeting Info */}
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <span className="font-medium text-slate-700">Purpose:</span>
                            <span className="text-slate-600">{review.purpose || "N/A"}</span>
                        </div>
                        {review.location && (
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-700">Location:</span>
                                <span className="text-slate-600">{review.location}</span>
                            </div>
                        )}
                        {review.projectTitle && (
                            <div className="flex items-center gap-2 text-sm">
                                <ClipboardCheck className="h-4 w-4 text-slate-500" />
                                <span className="font-medium text-slate-700">Project:</span>
                                <span className="text-slate-600">{review.projectTitle}</span>
                            </div>
                        )}
                    </div>

                    {/* Attendance */}
                    {attendance.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Attendance ({presentCount}/{attendance.length})
                                </h4>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7"
                                        onClick={() =>
                                            setAttendance((prev) =>
                                                prev.map((a) => ({ ...a, present: true }))
                                            )
                                        }
                                    >
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        All Present
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-xs h-7"
                                        onClick={() =>
                                            setAttendance((prev) =>
                                                prev.map((a) => ({ ...a, present: false }))
                                            )
                                        }
                                    >
                                        <UserX className="h-3 w-3 mr-1" />
                                        All Absent
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {attendance.map((student, index) => (
                                    <div
                                        key={student.studentId}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                            student.present
                                                ? "bg-emerald-50/50 border-emerald-200"
                                                : "bg-red-50/50 border-red-200"
                                        }`}
                                    >
                                        <Switch
                                            checked={student.present}
                                            onCheckedChange={() => toggleAttendance(index)}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900">
                                                {student.name}
                                            </p>
                                            <Badge
                                                className={`text-xs mt-1 ${
                                                    student.present
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {student.present ? "Present" : "Absent"}
                                            </Badge>
                                        </div>
                                        <Input
                                            placeholder="Remarks..."
                                            value={student.remarks}
                                            onChange={(e) => updateRemarks(index, e.target.value)}
                                            className="w-40 h-8 text-xs"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Review Notes and Grade */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
                        <div>
                            <Label htmlFor="review-notes" className="text-sm font-semibold text-slate-900 mb-2 block">
                                Review Notes *
                            </Label>
                            <Textarea
                                id="review-notes"
                                placeholder="Enter your review notes, feedback, and observations..."
                                value={notes}
                                onChange={(e) => {
                                    setNotes(e.target.value);
                                    if (error) setError(null);
                                }}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                        <div>
                            <Label htmlFor="review-grade" className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2 block">
                                <Star className="h-4 w-4 text-amber-500" /> Grade / Score
                            </Label>
                            <Select value={grade} onValueChange={setGrade}>
                                <SelectTrigger id="review-grade" className="h-10">
                                    <SelectValue placeholder="Select Grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A">Grade A</SelectItem>
                                    <SelectItem value="B">Grade B</SelectItem>
                                    <SelectItem value="C">Grade C</SelectItem>
                                    <SelectItem value="D">Grade D</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-500 mt-2">
                                Track continuous progress manually at each review step.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Complete Review
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ============== Details Dialog (for viewing completed review) ==============

function DetailsDialog({
    review,
    open,
    onOpenChange,
}: {
    review: CompletedReview;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState(review.notes || "");
    const [grade, setGrade] = useState(review.grade || "");
    const [isPending, startTransition] = useTransition();
    const reviewDate = new Date(review.datetime);

    const handleSave = () => {
        startTransition(async () => {
            const result = await completeMeetingReview({
                meetingId: review.id,
                notes,
                grade: grade || undefined,
                attendance: [], // Leave existing attendance untouched
            });

            if (result.success) {
                setIsEditing(false);
                onOpenChange(false);
            } else {
                alert("Failed to update review");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                Review Details
                            </DialogTitle>
                            <DialogDescription>
                                Completed review for{" "}
                                <span className="font-medium text-slate-900">
                                    {review.groupName}
                                </span>
                            </DialogDescription>
                        </div>
                        {!isEditing && (
                            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                                <Edit3 className="h-4 w-4 text-slate-500 hover:text-emerald-600" />
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Group
                            </p>
                            <p className="text-sm font-medium text-slate-900">
                                {review.groupName || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Project
                            </p>
                            <p className="text-sm font-medium text-slate-900">
                                {review.projectTitle || "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Date
                            </p>
                            <p className="text-sm font-medium text-slate-900">
                                {reviewDate.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                        <div className="space-y-1 p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                            <Label htmlFor="edit-grade" className="text-xs font-medium text-emerald-600 uppercase tracking-wider flex items-center gap-1 mb-1">
                                <Star className="h-3 w-3" /> Grade
                            </Label>
                            {isEditing ? (
                                <Select value={grade} onValueChange={setGrade}>
                                    <SelectTrigger id="edit-grade" className="h-8 bg-white text-emerald-800">
                                        <SelectValue placeholder="Grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Grade A</SelectItem>
                                        <SelectItem value="B">Grade B</SelectItem>
                                        <SelectItem value="C">Grade C</SelectItem>
                                        <SelectItem value="D">Grade D</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm font-bold text-emerald-700">
                                    {review.grade || "No Grade Assigned"}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Purpose
                            </p>
                            <p className="text-sm text-slate-700">
                                {review.purpose || "N/A"}
                            </p>
                        </div>
                        {review.projectTitle && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                    Project
                                </p>
                                <p className="text-sm text-slate-700">
                                    {review.projectTitle}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="edit-notes" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Review Notes
                        </Label>
                        {isEditing ? (
                            <Textarea
                                id="edit-notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                        ) : review.notes ? (
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                    {review.notes}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No notes available.</p>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={handleSave}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}