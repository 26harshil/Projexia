// /components/section/StudentNavbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NAVBAR_CONFIG } from "@/lib/navbar-config";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Calendar,
  FileText,
  Menu,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  "My Project": FolderKanban,
  "My Group": Users,
  Meetings: Calendar,
  Reports: FileText,
};

function UserProfileAvatar() {
  const { user } = useUser();
  if (user?.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" />
    );
  }
  return <span>{user?.firstName?.charAt(0) || "S"}</span>;
}

export default function StudentNavbar() {
  const scrolled = useScroll();
  const pathname = usePathname();
  const { title, links } = NAVBAR_CONFIG.STUDENT;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-[#050A14]/90 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-900/20"
          : "bg-[#050A14]/70 backdrop-blur-md border-b border-blue-500/10"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/student" className="flex items-center gap-2 group">
          <Image
            src="/Logo.png"
            alt="Student Portal Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {title}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link, index) => {
            const Icon = iconMap[link.name] || LayoutDashboard;
            const isActive = pathname === link.href;

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-cyan-300 hover:bg-blue-500/10"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="studentActiveTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/30"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("h-4 w-4 relative z-10", isActive && "text-white")} />
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <Sparkles className="h-3 w-3 relative z-10 text-cyan-200" />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* User Button - Links to profile */}
          <Link href="/profile" className="group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative h-9 w-9 rounded-full ring-2 ring-blue-500/40 ring-offset-2 ring-offset-[#050A14] bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                <UserProfileAvatar />
              </div>
            </motion.div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-white hover:bg-blue-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-[#07111F] border-l border-blue-500/20 backdrop-blur-xl">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 px-2 mb-4">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/30">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Student Portal
                  </span>
                </div>
                {links.map((link, index) => {
                  const Icon = iconMap[link.name] || LayoutDashboard;
                  const isActive = pathname === link.href;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                          isActive
                            ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-400 hover:bg-blue-500/10 hover:text-cyan-300"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{link.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
