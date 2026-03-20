"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-sm hover:text-foreground/80">
            Planner Casablanca
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/search" className="hover:text-foreground transition-colors">
              Caută
            </Link>
            <Link href="/calendar" className="hover:text-foreground transition-colors">
              Calendar
            </Link>
            <Link href="/pipeline" className="hover:text-foreground transition-colors">
              Pipeline
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {session.user?.name}
          </span>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs"
          >
            Ieși
          </Button>
        </div>
      </div>
    </header>
  );
}
