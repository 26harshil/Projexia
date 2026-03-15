"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
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
          ? "bg-[#050A14]/90 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-blue-900/20"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo.png"
              alt="Projexia Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition">Features</Link>
            <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition">About</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/check-role">
              <Button variant="ghost" className="text-sm font-medium">Log In</Button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/check-role">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5">Get Started</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
