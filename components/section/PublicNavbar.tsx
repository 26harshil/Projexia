"use client";

import Link from "next/link";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";

export default function PublicNavbar() {
  const scrolled = useScroll();

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-white/70 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ProjectHub
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">Features</Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/check-role">
              <Button variant="ghost" className="text-sm font-medium">Log In</Button>
            </SignInButton>
            <SignInButton mode="modal" forceRedirectUrl="/check-role">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5">Get Started</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
