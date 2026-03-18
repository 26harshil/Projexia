import ChatComponent from "@/components/ui/Chat";
import { getUserRole } from "@/app/actions/getUserRole";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Role } from "@/app/generated/prisma/client";

function getDashboardHref(role: Role | null): string {
  switch (role) {
    case Role.ADMIN:
      return "/admin/dashboard";
    case Role.FACULTY:
      return "/faculty/dashboard";
    case Role.STUDENT:
    default:
      return "/student/dashboard";
  }
}

export default async function ChatPage() {
  const role = await getUserRole();
  const dashboardHref = getDashboardHref(role);

  return (
    <div className="h-screen w-full flex flex-col bg-[linear-gradient(135deg,#050A14_0%,#07111F_45%,#050A14_100%)]">
      {/* ── Top Header Bar ── */}
      <div className="shrink-0 flex items-center gap-4 px-4 md:px-6 py-3 border-b border-[#3B9EFF22] bg-[#060D1Ccc] backdrop-blur-md">
        {/* Back Button */}
        <Link
          href={dashboardHref}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all
            border border-[#3B9EFF44] bg-[#091325] text-[#7DC8FF]
            hover:bg-[#102341] hover:border-[#3B9EFF88] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>

        {/* Page Title */}
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#E8EDF5]">Communication Hub</h1>
          <p className="text-xs text-[#5A7FA8] leading-none">
            Chat with faculty members, project partners, and administrators.
          </p>
        </div>

        {/* Role badge */}
        {role && (
          <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border
            border-[#3B9EFF44] bg-[#0F2344] text-[#7DC8FF]">
            {role}
          </span>
        )}
      </div>

      {/* ── Chat Component ── */}
      <div className="flex-1 overflow-hidden p-4 md:p-6">
        <div className="h-full max-w-7xl mx-auto">
          <ChatComponent role={role ?? undefined} />
        </div>
      </div>
    </div>
  );
}
