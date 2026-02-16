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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

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
                                        <PendingReviewCard key={review.id} review={review} />
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
                                        <CompletedReviewCard key={review.id} review={review} />
                                    ))}
                                </motion.div>
                            ) : (
                                <EmptyState type="completed" />
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}

function PendingReviewCard({ review }: { review: PendingReview }) {
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

function CompletedReviewCard({ review }: { review: CompletedReview }) {
    const reviewDate = new Date(review.datetime);

    return (
        <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Completed Indicator */}
                    <div className="shrink-0 text-center p-3 rounded-xl bg-emerald-100">
                        <CheckCircle2 className="h-6 w-6 mx-auto text-emerald-600" />
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
                        <Button variant="outline" size="sm" className="border-slate-200">
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
