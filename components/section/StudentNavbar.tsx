// /components/section/StudentNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
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
  X,
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
          ? "bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-lg shadow-emerald-500/5"
          : "bg-white/50 backdrop-blur-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/student" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 p-2 rounded-xl">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          </motion.div>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
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
                        : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 rounded-xl"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={cn("h-4 w-4 relative z-10", isActive && "text-white")} />
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <Sparkles className="h-3 w-3 relative z-10 text-yellow-300" />
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* User Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur opacity-30" />
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-emerald-200 ring-offset-2"
                }
              }}
            />
          </motion.div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-5 w-5 text-slate-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-xl">
              <div className="flex flex-col gap-4 mt-8">
                <div className="flex items-center gap-2 px-2 mb-4">
                  <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 p-2 rounded-xl">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
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
                            ? "bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-500 text-white shadow-lg shadow-emerald-500/25"
                            : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-600"
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
