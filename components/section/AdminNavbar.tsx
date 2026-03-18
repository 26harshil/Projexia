// /components/section/AdminNavbar.tsx
"use client";

import Image from "next/image";
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
          ? "bg-[#050A14]/90 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-900/20"
          : "bg-[#050A14]/80 backdrop-blur-md border-b border-blue-500/10"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3 group">
          <Image
            src="/Logo.png"
            alt="Admin Portal Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
            priority
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">
              {title}
            </span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wider -mt-0.5">
              SYSTEM ADMIN
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 bg-white/5 border border-blue-500/15 p-1 rounded-xl backdrop-blur-sm">
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
                        ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4",
                      isActive ? "text-white" : "text-slate-500"
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





          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-blue-500/20 mx-2" />

          {/* User Section */}
          <Link href="/profile" className="flex items-center gap-3 group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">Admin</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-blue-500/30 text-blue-400 bg-blue-500/10">
                Super Admin
              </Badge>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <div className="h-9 w-9 rounded-full ring-2 ring-blue-500/40 ring-offset-2 ring-offset-[#050A14] bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                <UserProfileAvatar />
              </div>
            </motion.div>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="ml-2 text-slate-400 hover:text-white hover:bg-blue-500/10">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[#07111F] border-l border-blue-500/20 p-0">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="p-6 border-b border-blue-500/15 bg-gradient-to-r from-blue-600/10 to-cyan-500/10">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/30">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-white">Admin Portal</span>
                      <p className="text-xs text-blue-400 font-medium">System Administration</p>
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
                              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                              : "text-slate-400 hover:bg-blue-500/10 hover:text-cyan-300"
                          )}
                        >
                          <Icon className={cn(
                            "h-5 w-5",
                            isActive ? "text-white" : "text-slate-500"
                          )} />
                          <span className="font-medium">{link.name}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-blue-500/15 bg-white/3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-blue-500/15">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">System Status</p>
                      <p className="text-[10px] text-cyan-400">All systems operational</p>
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
