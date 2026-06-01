"use client";

import { motion } from "framer-motion";
import { SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  ExternalLink,
  FolderKanban,
  GraduationCap,
  Hash,
  LogOut,
  Mail,
  Phone,
  Save,
  PencilLine,
  Shield,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  updateFacultyPhone,
  updateProfileName,
  updateStudentPhone,
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
  {
    label: string;
    gradient: string;
    accent: string;
    soft: string;
    icon: React.ElementType;
  }
> = {
  ADMIN: {
    label: "Administrator",
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
    accent: "text-emerald-700",
    soft: "bg-emerald-50 border-emerald-100",
    icon: Shield,
  },
  FACULTY: {
    label: "Faculty Member",
    gradient: "from-blue-700 via-indigo-600 to-cyan-500",
    accent: "text-blue-700",
    soft: "bg-blue-50 border-blue-100",
    icon: Briefcase,
  },
  STUDENT: {
    label: "Student",
    gradient: "from-indigo-700 via-blue-600 to-cyan-500",
    accent: "text-indigo-700",
    soft: "bg-indigo-50 border-indigo-100",
    icon: GraduationCap,
  },
};

function formatDate(dateInput: string | number | null) {
  if (!dateInput) return "N/A";
  return new Date(dateInput).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateInput: string | number | null) {
  if (!dateInput) return "N/A";
  return new Date(dateInput).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function primaryFallbackName(email: string | null | undefined) {
  if (!email) return "User";
  const local = email.split("@")[0] || "User";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function ProfileContent({ profile }: ProfileContentProps) {
  const router = useRouter();
  const role = roleConfig[profile.role] || roleConfig.STUDENT;
  const RoleIcon = role.icon;
  const derivedProfileName =
    profile.name?.trim() ||
    profile.student?.studentname?.trim() ||
    profile.staff?.staffname?.trim() ||
    `${profile.firstName} ${profile.lastName}`.trim() ||
    primaryFallbackName(profile.email);

  const [activeTab, setActiveTab] = useState<"overview" | "academic" | "edit">(
    "overview",
  );
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(derivedProfileName);
  const [currentName, setCurrentName] = useState(derivedProfileName || "User");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaveMessage, setNameSaveMessage] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState(
    profile.role === "STUDENT"
      ? profile.student?.phone || ""
      : profile.staff?.phone || "",
  );
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const dashboardHref =
    profile.role === "ADMIN"
      ? "/admin/dashboard"
      : profile.role === "FACULTY"
        ? "/faculty/dashboard"
        : "/student/dashboard";

  const projectGroups = profile.student?.projectGroups || [];
  const primaryEmail =
    profile.emailAddresses.find((item) => item.isPrimary)?.email ||
    profile.email;
  const fallbackPhone =
    phoneValue || profile.phoneNumbers[0]?.phone || "Not provided";
  const profileDescription =
    profile.student?.description ||
    profile.staff?.description ||
    "No profile description has been added yet.";
  const leaderCount = projectGroups.filter((group) => group.isLeader).length;
  const profileCompletion = useMemo(() => {
    const checks = [
      Boolean(currentName?.trim()),
      Boolean(primaryEmail?.trim()),
      Boolean(fallbackPhone && fallbackPhone !== "Not provided"),
      profile.role !== "STUDENT" ||
        Boolean(profile.student?.enrollment?.trim()),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [
    currentName,
    primaryEmail,
    fallbackPhone,
    profile.role,
    profile.student?.enrollment,
  ]);

  const topStats =
    profile.role === "STUDENT"
      ? [
          {
            label: "Project Groups",
            value: String(projectGroups.length),
            sub: "currently linked",
            icon: FolderKanban,
            color: "from-indigo-500 to-blue-500",
          },
          {
            label: "Leadership Roles",
            value: String(leaderCount),
            sub: "group leader positions",
            icon: Crown,
            color: "from-amber-500 to-orange-400",
          },
          {
            label: "Profile Completion",
            value: `${profileCompletion}%`,
            sub: "account readiness",
            icon: Sparkles,
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "Account Status",
            value: profile.isactive ? "Active" : "Inactive",
            sub: `last sign-in ${formatDate(profile.lastSignInAt)}`,
            icon: CheckCircle2,
            color: "from-cyan-500 to-sky-500",
          },
        ]
      : [
          {
            label: "Profile Completion",
            value: `${profileCompletion}%`,
            sub: "contact + identity",
            icon: Sparkles,
            color: "from-indigo-500 to-blue-500",
          },
          {
            label: "Role Access",
            value: role.label,
            sub: "current permission level",
            icon: RoleIcon,
            color: "from-emerald-500 to-teal-500",
          },
          {
            label: "System ID",
            value:
              profile.role === "FACULTY" && profile.staff
                ? String(profile.staff.staffid)
                : String(profile.userid),
            sub:
              profile.role === "FACULTY"
                ? "faculty identifier"
                : "user identifier",
            icon: Hash,
            color: "from-violet-500 to-purple-500",
          },
          {
            label: "Account Status",
            value: profile.isactive ? "Active" : "Inactive",
            sub: `joined ${formatDate(profile.createdAt)}`,
            icon: CheckCircle2,
            color: "from-amber-500 to-orange-400",
          },
        ];

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
      setNameSaveMessage("Name updated successfully.");
      setTimeout(() => setNameSaveMessage(""), 3000);
      router.refresh();
    } catch (error) {
      setNameSaveMessage("Error updating name");
      console.error(error);
    } finally {
      setIsSavingName(false);
    }
  };

  const handleSavePhone = async () => {
    setIsSavingPhone(true);
    setSaveMessage("");
    try {
      if (profile.role === "STUDENT") {
        await updateStudentPhone(phoneValue);
      } else if (profile.role === "FACULTY") {
        await updateFacultyPhone(phoneValue);
      }
      setSaveMessage("Phone number updated successfully.");
      setEditingPhone(false);
      setTimeout(() => setSaveMessage(""), 3000);
      router.refresh();
    } catch (error) {
      setSaveMessage("Error updating phone number");
      console.error(error);
    } finally {
      setIsSavingPhone(false);
    }
  };

  const resetPhoneEdit = () => {
    setPhoneValue(
      profile.role === "STUDENT"
        ? profile.student?.phone || ""
        : profile.staff?.phone || "",
    );
    setEditingPhone(false);
    setSaveMessage("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,158,255,0.16),transparent_34%),linear-gradient(180deg,#050A14_0%,#07111F_46%,#050A14_100%)] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-slate-950/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href={dashboardHref}>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <div className="hidden h-6 w-px bg-slate-800 sm:block" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                SPMS Profile
              </p>
              <p className="text-sm font-semibold text-slate-100">
                {role.label}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SignOutButton>
              <Button className="bg-slate-100 text-slate-950 hover:bg-white">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <section className="overflow-hidden rounded-[32px] border border-slate-800/70 bg-slate-950/70 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
          <div className={cn("relative h-24 bg-linear-to-r", role.gradient)}>
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            />
          </div>

          <div className="px-5 pb-6 sm:px-6">
            <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <Image
                    src={profile.imageUrl}
                    alt={currentName}
                    width={104}
                    height={104}
                    className="h-24 w-24 rounded-3xl border-4 border-slate-950 object-cover shadow-lg shadow-blue-950/30 sm:h-26 sm:w-26"
                  />
                  <span
                    className={cn(
                      "absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-950",
                      profile.isactive ? "bg-emerald-400" : "bg-slate-400",
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80">
                      Your Profile
                    </p>
                    {editingName ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={nameValue}
                          onChange={(e) => setNameValue(e.target.value)}
                          className="min-w-[260px] flex-1 rounded-2xl border border-cyan-400/30 bg-slate-950/80 px-4 py-3 text-2xl font-bold tracking-tight text-white outline-none focus:border-cyan-300 sm:text-3xl"
                          placeholder="Enter your name"
                        />
                        <Button
                          onClick={handleSaveName}
                          disabled={isSavingName}
                          className="bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          className="border-slate-700 bg-slate-950/70 text-slate-200 hover:bg-white/5"
                          onClick={() => {
                            setNameValue(currentName || derivedProfileName);
                            setEditingName(false);
                            setNameSaveMessage("");
                          }}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <h1 className="inline-block rounded-2xl bg-slate-950/55 px-4 py-2 text-4xl font-black tracking-tight text-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] sm:text-5xl lg:text-6xl">
                          {currentName || "User"}
                        </h1>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-cyan-400/30 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/20 hover:text-white"
                          onClick={() => setEditingName(true)}
                        >
                          <PencilLine className="mr-2 h-4 w-4" />
                          Edit Name
                        </Button>
                      </div>
                    )}
                    {nameSaveMessage && (
                      <p
                        className={cn(
                          "mt-2 text-sm",
                          nameSaveMessage.toLowerCase().includes("error") ||
                            nameSaveMessage.toLowerCase().includes("required")
                            ? "text-red-300"
                            : "text-emerald-300",
                        )}
                      >
                        {nameSaveMessage}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
                      <RoleIcon className="mr-1.5 h-3.5 w-3.5" />
                      {role.label}
                    </Badge>
                    {profile.role === "STUDENT" && leaderCount > 0 && (
                      <Badge className="border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
                        <Crown className="mr-1.5 h-3.5 w-3.5" />
                        {leaderCount} Leadership Role
                        {leaderCount > 1 ? "s" : ""}
                      </Badge>
                    )}
                    <Badge className="border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      {primaryEmail}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  ✉️ Primary Email
                </p>
                <p className="truncate text-sm font-semibold text-slate-800">
                  {primaryEmail}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    📞 Phone
                  </p>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (editingPhone) {
                        void handleSavePhone();
                      } else {
                        setEditingPhone(true);
                        setSaveMessage("");
                      }
                    }}
                    disabled={isSavingPhone}
                    className="h-8 bg-cyan-500 px-3 text-slate-950 hover:bg-cyan-400"
                  >
                    {editingPhone ? (
                      <>
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Save
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
                {editingPhone ? (
                  <input
                    type="tel"
                    value={phoneValue}
                    onChange={(e) => setPhoneValue(e.target.value)}
                    className="w-full rounded-xl border border-cyan-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-cyan-500"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {fallbackPhone}
                  </p>
                )}
                {saveMessage && (
                  <p
                    className={cn(
                      "mt-2 text-xs",
                      saveMessage.toLowerCase().includes("error")
                        ? "text-red-600"
                        : "text-emerald-600",
                    )}
                  >
                    {saveMessage}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {profile.role === "STUDENT" ? "# Enrollment" : "🛡️ Role Access"}
                </p>
                <p className="truncate text-sm font-semibold text-slate-800">
                  {profile.role === "STUDENT"
                    ? profile.student?.enrollment || "Not provided"
                    : role.label}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  📅 Joined
                </p>
                <p className="truncate text-sm font-semibold text-slate-800">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {topStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-slate-800/70 bg-slate-950/60 p-5 shadow-lg shadow-blue-950/10 transition hover:-translate-y-0.5 hover:border-cyan-400/25 hover:shadow-blue-950/20"
            >
              <div
                className={cn(
                  "mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-sm",
                  stat.color,
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-slate-200">
                {stat.label}
              </p>
              <p className="mt-0.5 text-xs text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-[32px] border border-slate-800/70 bg-slate-950/70 shadow-2xl shadow-blue-950/20 backdrop-blur-xl">
          <div className="flex border-b border-slate-800/70">
            {(["overview", "academic"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 border-b-2 px-5 py-4 text-sm font-semibold capitalize transition sm:flex-none",
                  activeTab === tab
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                    : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100",
                )}
              >
                {tab === "overview" && "Profile Overview"}
                {tab === "academic" &&
                  (profile.role === "STUDENT"
                    ? "Projects & Academic"
                    : "Professional Info")}
              </button>
            ))}
          </div>
          <div className="p-5 sm:p-6">
            {activeTab === "overview" && (
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-base font-bold text-slate-100">
                      About
                    </h3>
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
                      <p className="text-sm leading-7 text-slate-300">
                        {profileDescription}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-base font-bold text-slate-100">
                      Identity Snapshot
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        {
                          icon: User,
                          label: "Display Name",
                          value: currentName,
                        },
                        {
                          icon: Mail,
                          label: "Primary Email",
                          value: primaryEmail,
                        },
                        { icon: Phone, label: "Phone", value: fallbackPhone },
                        {
                          icon: Hash,
                          label:
                            profile.role === "STUDENT"
                              ? "Enrollment Number"
                              : "System ID",
                          value:
                            profile.role === "STUDENT"
                              ? profile.student?.enrollment || "Not provided"
                              : String(profile.userid),
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4"
                        >
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200 shadow-sm shadow-blue-950/20">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-100">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-base font-bold text-slate-100">
                      Account Health
                    </h3>
                    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">
                          Profile completeness
                        </span>
                        <span className="text-sm font-bold text-cyan-200">
                          {profileCompletion}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          className="h-full rounded-full bg-linear-to-r from-cyan-400 to-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${profileCompletion}%` }}
                          transition={{ duration: 0.7 }}
                        />
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          {
                            label: "Account Status",
                            value: profile.isactive ? "Active" : "Inactive",
                          },
                          {
                            label: "Joined Platform",
                            value: formatDate(profile.createdAt),
                          },
                          {
                            label: "Last Sign-In",
                            value: formatDateTime(profile.lastSignInAt),
                          },
                          {
                            label: "Clerk Created",
                            value: formatDate(profile.createdAtClerk),
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/70 px-4 py-3"
                          >
                            <span className="text-sm text-slate-400">
                              {item.label}
                            </span>
                            <span className="text-sm font-semibold text-slate-100">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "academic" && profile.role === "STUDENT" && (
              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-base font-bold text-slate-100">
                    Linked Project Groups
                  </h3>
                  {projectGroups.length > 0 ? (
                    <div className="space-y-3">
                      {projectGroups.map((group, index) => (
                        <div
                          key={`${group.groupName}-${index}`}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-100">
                                {group.projectTitle || group.groupName}
                              </p>
                              {group.isLeader && (
                                <Badge className="border border-amber-400/30 bg-amber-400/10 text-amber-200">
                                  <Crown className="mr-1.5 h-3.5 w-3.5" />
                                  Group Leader
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-slate-400">
                              Group: {group.groupName}
                            </p>
                            <p className="text-sm text-slate-400">
                              Area: {group.projectArea || "Not specified"}
                            </p>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200 shadow-sm shadow-blue-950/20">
                            <FolderKanban className="h-5 w-5" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
                      No project groups are linked to this student yet.
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      label: "Enrollment",
                      value: profile.student?.enrollment || "Not provided",
                      icon: GraduationCap,
                    },
                    {
                      label: "Leadership Count",
                      value: leaderCount,
                      icon: Crown,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200 shadow-sm shadow-blue-950/20">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        {item.label}
                      </p>
                      <p className="mt-1 text-lg font-bold text-slate-100">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "academic" && profile.role !== "STUDENT" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
                  <h3 className="mb-4 text-base font-bold text-slate-100">
                    Professional Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Staff ID",
                        value: profile.staff?.staffid || "N/A",
                        icon: Briefcase,
                      },
                      {
                        label: "Official Email",
                        value: profile.staff?.email || primaryEmail,
                        icon: Mail,
                      },
                      { label: "Phone", value: fallbackPhone, icon: Phone },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl bg-slate-950/70 px-4 py-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-cyan-200">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-slate-100">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-5">
                  <h3 className="mb-4 text-base font-bold text-slate-100">
                    Role Summary
                  </h3>
                  <div className="rounded-2xl border border-slate-800/70 bg-slate-950/70 p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-cyan-200">
                      <RoleIcon className="h-6 w-6" />
                    </div>
                    <p className="text-lg font-bold text-slate-100">
                      {role.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">
                      {profileDescription}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
