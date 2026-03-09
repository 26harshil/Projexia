// /components/section/AdminNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { NAVBAR_CONFIG } from "@/lib/navbar-config";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Settings2,
  Users,
  FolderKanban,
  Calendar,
  FileText,
  Menu,
  Shield,
  Bell,
  Search,
  Command,
  UserCog
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Users: UserCog,
  Students: Users,
  Projects: FolderKanban,
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
  return <span>{user?.firstName?.charAt(0) || "A"}</span>;
}

export default function AdminNavbar() {
  const scrolled = useScroll();
  const pathname = usePathname();
  const { title, links } = NAVBAR_CONFIG.ADMIN;
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
          : "bg-white border-b border-slate-100"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 p-2.5 rounded-xl">
              <Shield className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">
              {title}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold tracking-wider -mt-0.5">
              SYSTEM ADMIN
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-slate-50 p-1 rounded-xl">
          {links.map((link, index) => {
            const Icon = iconMap[link.name] || LayoutDashboard;
            const isActive = pathname === link.href;

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={link.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white text-emerald-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive ? "text-emerald-600" : "text-slate-400"
                    )} />
                    <span className="hidden xl:inline">{link.name}</span>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Command Palette Trigger */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex"
          >
            <Button
              variant="outline"
              size="sm"
              className="text-slate-500 border-slate-200 hover:bg-slate-50 gap-2"
            >
              <Search className="h-4 w-4" />
              <span className="text-xs">Search...</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-600">
                <Command className="h-3 w-3" />K
              </kbd>
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
              className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-slate-200 mx-2" />

          {/* User Section - Links to custom profile page */}
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">Admin</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-emerald-200 text-emerald-600">
                Super Admin
              </Badge>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="h-9 w-9 rounded-full ring-2 ring-emerald-100 ring-offset-2 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                <UserProfileAvatar />
              </div>
            </motion.div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="ml-2">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-2.5 rounded-xl">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Admin Portal</span>
                      <p className="text-xs text-emerald-600 font-medium">System Administration</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                  {links.map((link, index) => {
                    const Icon = iconMap[link.name] || LayoutDashboard;
                    const isActive = pathname === link.href;

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
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5",
                            isActive ? "text-emerald-600" : "text-slate-400"
                          )} />
                          <span className="font-medium">{link.name}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-900">System Status</p>
                      <p className="text-[10px] text-green-600">All systems operational</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
