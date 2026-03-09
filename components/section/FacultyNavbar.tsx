// /components/section/FacultyNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NAVBAR_CONFIG } from "@/lib/navbar-config";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Calendar,
  FileText,
  Menu,
  GraduationCap,
  Bell,
  Search,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";


const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  "My Groups": Users,
  "Project Reviews": ClipboardCheck,
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
  return <span>{user?.firstName?.charAt(0) || "F"}</span>;
}

export default function FacultyNavbar() {
  const scrolled = useScroll();
  const pathname = usePathname();
  const { title, links } = NAVBAR_CONFIG.FACULTY;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm"
          : "bg-white border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/faculty/dashboard" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-emerald-600 p-2.5 rounded-xl">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">
              {title}
            </span>
            <span className="text-[10px] text-emerald-600 font-medium -mt-1">
              MANAGEMENT SYSTEM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link, index) => {
            const Icon = iconMap[link.name] || LayoutDashboard;
            // Handle active state for sub-routes as well
            const isActive = pathname === link.href || (link.href !== "/faculty/dashboard" && pathname.startsWith(link.href));

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={link.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-emerald-700 bg-emerald-50 shadow-sm shadow-emerald-100"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-emerald-600" : "text-slate-400"
                    )} />
                    <span>{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="facultyActiveIndicator"
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-600 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search Button - Desktop */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden md:flex"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Search className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-slate-200 mx-2" />

          {/* User Button - Links to custom profile page */}
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-slate-900 group-hover:text-emerald-600 transition-colors">Faculty</span>
              <span className="text-xs text-slate-500">Professor</span>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="h-9 w-9 rounded-full ring-2 ring-emerald-100 ring-offset-2 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                <UserProfileAvatar />
              </div>
            </motion.div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-slate-100">
                  <Link href="/faculty/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2.5 rounded-xl">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Faculty Portal</span>
                      <p className="text-xs text-slate-500">Management System</p>
                    </div>
                  </Link>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                  {links.map((link, index) => {
                    const Icon = iconMap[link.name] || LayoutDashboard;
                    const isActive = pathname === link.href || (link.href !== "/faculty/dashboard" && pathname.startsWith(link.href));

                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5",
                            isActive ? "text-emerald-600" : "text-slate-400"
                          )} />
                          <span className="font-medium">{link.name}</span>
                          {isActive && (
                            <div className="ml-auto">
                              <Sparkles className="h-4 w-4 text-emerald-400" />
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <p className="text-xs text-slate-500 text-center">
                    © 2024 Faculty Portal
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
