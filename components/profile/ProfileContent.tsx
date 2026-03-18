// /components/profile/ProfileContent.tsx
"use client";

import { motion } from "framer-motion";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  updateStudentPhone,
  updateFacultyPhone,
  updateStudentEnrollmentNumber,
  updateProfileName,
} from "@/app/actions/profileActions";

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
    enrollment: string | null;
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

const roleConfig: Record<
  string,
  { label: string; color: string; gradient: string; icon: React.ElementType }
> = {
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
  const initialName =
    profile.name?.trim() || `${profile.firstName} ${profile.lastName}`.trim();

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(initialName);
  const [currentName, setCurrentName] = useState(initialName || "User");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaveMessage, setNameSaveMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(
    profile.role === "STUDENT"
      ? profile.student?.phone || ""
      : profile.staff?.phone || ""
  );
  const [editingEnrollment, setEditingEnrollment] = useState(false);
  const [enrollmentValue, setEnrollmentValue] = useState(
    profile.student?.enrollment ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSavingEnrollment, setIsSavingEnrollment] = useState(false);
  const [enrollmentSaveMessage, setEnrollmentSaveMessage] = useState("");

  const dashboardHref =
    profile.role === "ADMIN"
      ? "/admin/dashboard"
      : profile.role === "FACULTY"
        ? "/faculty/dashboard"
        : "/student/dashboard";

  const handleSaveName = async () => {
    const trimmedName = nameValue.trim();
    if (!trimmedName) {
      setNameSaveMessage("Name is required");
      return;
    }

    setIsSavingName(true);
    setNameSaveMessage("");
    try {
      await updateProfileName(trimmedName);
      setCurrentName(trimmedName);
      setNameValue(trimmedName);
      setEditingName(false);
      setNameSaveMessage("Name updated successfully!");
      setTimeout(() => setNameSaveMessage(""), 3000);
      router.refresh();
    } catch (error) {
      setNameSaveMessage("Error updating name");
      console.error(error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelName = () => {
    setNameValue(currentName);
    setEditingName(false);
    setNameSaveMessage("");
  };

  const handleSavePhone = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      if (profile.role === "STUDENT") {
        await updateStudentPhone(phoneValue);
      } else if (profile.role === "FACULTY") {
        await updateFacultyPhone(phoneValue);
      }
      setSaveMessage("Phone number updated successfully!");
      setEditingPhone(false);
      setTimeout(() => setSaveMessage(""), 3000);
      // Optionally refresh the page
      router.refresh();
    } catch (error) {
      setSaveMessage("Error updating phone number");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEnrollment = async () => {
    setIsSavingEnrollment(true);
    setEnrollmentSaveMessage("");
    try {
      await updateStudentEnrollmentNumber(enrollmentValue);
      setEnrollmentSaveMessage("Enrollment number updated successfully!");
      setEditingEnrollment(false);
      setTimeout(() => setEnrollmentSaveMessage(""), 3000);
      router.refresh();
    } catch (error) {
      setEnrollmentSaveMessage("Error updating enrollment number");
      console.error(error);
    } finally {
      setIsSavingEnrollment(false);
    }
  };

  const handleCancelEnrollment = () => {
    setEnrollmentValue(profile.student?.enrollment ?? "");
    setEditingEnrollment(false);
  };

  const handleCancelEdit = () => {
    setPhoneValue(
      profile.role === "STUDENT"
        ? profile.student?.phone || ""
        : profile.staff?.phone || ""
    );
    setEditingPhone(false);
  };

  return (
    <div className="min-h-screen bg-[#050A14]">
      {/* Header Banner */}
      <div className={cn("relative h-56 bg-linear-to-r", role.gradient)}>
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
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
          className="bg-white/5 backdrop-blur-md rounded-2xl border border-blue-500/20 shadow-xl shadow-blue-900/20 overflow-hidden"
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
                <div
                  className={cn(
                    "absolute -inset-1 bg-linear-to-r rounded-full blur-sm opacity-60",
                    role.gradient,
                  )}
                />
                <div className="relative">
                  <Image
                    src={profile.imageUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    width={96}
                    height={96}
                    className="rounded-full ring-4 ring-white object-cover"
                  />
                  {/* Active indicator */}
                  <div
                    className={cn(
                      "absolute bottom-1 right-1 h-5 w-5 rounded-full border-3 border-white",
                      profile.isactive ? "bg-blue-500" : "bg-slate-400",
                    )}
                  />
                </div>
              </motion.div>

              {/* Name + Role */}
              <div className="flex-1 text-center sm:text-left">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-white"
                >
                  {currentName}
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32 }}
                  className="mt-2"
                >
                  {editingName ? (
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        className="min-w-55 text-sm px-2 py-1 border border-blue-500/25 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                        placeholder="Enter your name"
                      />
                      <button
                        onClick={handleSaveName}
                        disabled={isSavingName}
                        className="bg-slate-800 hover:bg-slate-900 text-white px-2 py-1 rounded-md text-xs disabled:opacity-50"
                      >
                        <Save className="h-3 w-3" />
                      </button>
                      <button
                        onClick={handleCancelName}
                        className="bg-slate-300 hover:bg-slate-400 text-slate-200 px-2 py-1 rounded-md text-xs"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-xs text-slate-300 hover:text-white underline"
                    >
                      Edit name
                    </button>
                  )}
                  {nameSaveMessage && (
                    <p
                      className={`text-xs mt-1 ${nameSaveMessage.includes("Error") ||
                          nameSaveMessage.includes("required")
                          ? "text-red-600"
                          : "text-cyan-400"
                        }`}
                    >
                      {nameSaveMessage}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2"
                >
                  <Badge
                    className={cn(
                      "text-sm px-3 py-1",
                      role.color === "emerald" &&
                      "bg-blue-500/15 text-cyan-400",
                      role.color === "blue" && "bg-blue-500/15 text-blue-700",
                      role.color === "violet" &&
                      "bg-violet-100 text-violet-700",
                    )}
                  >
                    <RoleIcon className="h-3.5 w-3.5 mr-1.5" />
                    {role.label}
                  </Badge>
                  <Badge
                    className={cn(
                      "text-xs",
                      profile.isactive
                        ? "bg-blue-500/10 text-cyan-400 border-cyan-500/25"
                        : "bg-red-500/10 text-red-600 border-red-200",
                    )}
                  >
                    {profile.isactive ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3 mr-1" /> Inactive
                      </>
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
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-slate-400" />
              Account Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              {profile.emailAddresses.map((e, i) => (
                <div
                  key={i}
                  className="bg-white/5 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="bg-blue-500/15 p-2 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">
                      Email{" "}
                      {e.isPrimary && (
                        <span className="text-cyan-400">(Primary)</span>
                      )}
                    </p>
                    <p className="text-sm font-medium text-white truncate">
                      {e.email}
                    </p>
                  </div>
                </div>
              ))}

              {/* Phone - Editable for Students and Faculty */}
              {(profile.role === "STUDENT" || profile.role === "FACULTY") &&
                (profile.student || profile.staff) ? (
                <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-blue-500/15 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">
                      Phone
                    </p>
                    {editingPhone ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="tel"
                          value={phoneValue}
                          onChange={(e) => setPhoneValue(e.target.value)}
                          className="flex-1 text-sm px-2 py-1 border border-blue-500/25 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter phone number"
                        />
                        <button
                          onClick={handleSavePhone}
                          disabled={isSaving}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md text-xs disabled:opacity-50"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-slate-300 hover:bg-slate-400 text-slate-200 px-2 py-1 rounded-md text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-medium text-white">
                          {phoneValue || "Not provided"}
                        </p>
                        <button
                          onClick={() => setEditingPhone(true)}
                          className="ml-2 text-xs text-cyan-400 hover:text-cyan-400 underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {saveMessage && (
                      <p
                        className={`text-xs mt-1 ${saveMessage.includes("Error")
                            ? "text-red-600"
                            : "text-cyan-400"
                          }`}
                      >
                        {saveMessage}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase">
                      Phone
                    </p>
                    <p className="text-sm text-slate-400 italic">
                      Not provided
                    </p>
                  </div>
                </div>
              )}

              {/* Enrollment Number - For Students (editable) */}
              {profile.role === "STUDENT" && profile.student && (
                <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <Hash className="h-4 w-4 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium text-slate-400 uppercase">
                      Enrollment No
                    </p>
                    {editingEnrollment ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={enrollmentValue}
                          onChange={(e) => setEnrollmentValue(e.target.value)}
                          className="flex-1 text-sm px-2 py-1 border border-blue-500/25 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                          placeholder="Enter enrollment number"
                        />
                        <button
                          onClick={handleSaveEnrollment}
                          disabled={isSavingEnrollment}
                          className="bg-violet-500 hover:bg-violet-600 text-white px-2 py-1 rounded-md text-xs disabled:opacity-50"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button
                          onClick={handleCancelEnrollment}
                          className="bg-slate-300 hover:bg-slate-400 text-slate-200 px-2 py-1 rounded-md text-xs"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm font-mono text-white">
                          {profile.student.enrollment || "Not provided"}
                        </p>
                        <button
                          onClick={() => setEditingEnrollment(true)}
                          className="ml-2 text-xs text-violet-600 hover:text-violet-700 underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                    {enrollmentSaveMessage && (
                      <p
                        className={`text-xs mt-1 ${enrollmentSaveMessage.includes("Error")
                            ? "text-red-600"
                            : "text-violet-600"
                          }`}
                      >
                        {enrollmentSaveMessage}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Faculty ID - For Faculty */}
              {profile.role === "FACULTY" && profile.staff && (
                <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                  <div className="bg-blue-500/15 p-2 rounded-lg">
                    <Briefcase className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase">
                      Faculty ID
                    </p>
                    <p className="text-sm font-mono text-white">
                      {profile.staff.staffid}
                    </p>
                  </div>
                </div>
              )}

              {/* User ID - System ID, separate from enrollment */}
              <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-violet-100 p-2 rounded-lg">
                  <Hash className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    User ID
                  </p>
                  <p className="text-sm font-mono text-white">
                    {profile.userid}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    role.color === "emerald" && "bg-blue-500/15",
                    role.color === "blue" && "bg-blue-500/15",
                    role.color === "violet" && "bg-violet-100",
                  )}
                >
                  <RoleIcon
                    className={cn(
                      "h-4 w-4",
                      role.color === "emerald" && "text-cyan-400",
                      role.color === "blue" && "text-blue-400",
                      role.color === "violet" && "text-violet-600",
                    )}
                  />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    Role
                  </p>
                  <p className="text-sm font-medium text-white">
                    {role.label}
                  </p>
                </div>
              </div>

              {/* Joined Date */}
              <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-amber-500/15 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    Joined
                  </p>
                  <p className="text-sm font-medium text-white">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>

              {/* Last Sign In */}
              <div className="bg-white/5 rounded-xl p-4 flex items-start gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <Clock className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">
                    Last Sign In
                  </p>
                  <p className="text-sm font-medium text-white">
                    {formatTime(profile.lastSignInAt)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Footer Actions */}
          <Separator />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-6 md:p-8 bg-white/5/50"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">{ }</p>
              <div className="flex gap-3">
                <Link href={dashboardHref}>
                  <Button
                    variant="outline"
                    className="border-blue-500/20 text-slate-300"
                  >
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