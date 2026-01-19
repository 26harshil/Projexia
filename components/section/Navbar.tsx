"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { NAVBAR_CONFIG, Role } from "@/lib/navbar-config";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const scrolled = useScroll();
  const router = useRouter();

  if (!isLoaded) return null;

  const role =
    (user?.publicMetadata?.role as Role) ?? "STUDENT";

  // Redirect user based on role
  if (role === "ADMIN") {
    router.push("/admin");
    return null;
  } else if (role === "FACULTY") {
    router.push("/faculty");
    return null;
  } else if (role === "STUDENT") {
    router.push("/student");
    return null;
  }

  const { title, links } = NAVBAR_CONFIG[role];

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all",
        scrolled
          ? "bg-background/80 backdrop-blur border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-8">
          <span className="text-lg font-semibold">{title}</span>

          {/* <nav className="hidden md:flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
              >
                {link.name}
              </Link>
            ))}
          </nav> */}
        </div>

        {/* Right */}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
