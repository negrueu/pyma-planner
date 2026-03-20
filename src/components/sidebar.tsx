"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/search", label: "Caută", icon: "🔍" },
  { href: "/calendar", label: "Calendar", icon: "📅" },
  { href: "/pipeline", label: "Pipeline", icon: "📊" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border">
        <div className="flex flex-col h-full">
          {/* Workspace name */}
          <div className="px-3 py-3 flex items-center gap-2">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              Planner Casablanca
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-0.5">
            {navItems.map((item) => {
              const active = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-2 py-1 rounded text-sm transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <span className="text-[13px]">{item.icon}</span>
                  <span className="text-[14px]">{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-2">
              <Link
                href="/event/new"
                className="flex items-center gap-2 px-2 py-1 rounded text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
              >
                <span className="text-[13px]">➕</span>
                <span className="text-[14px]">Eveniment nou</span>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sidebar-foreground/50 truncate">
                {session.user?.name}
              </span>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground px-1 py-0.5 rounded transition-colors"
                >
                  Ieși
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex items-center justify-around h-12">
          {[...navItems, { href: "/event/new", label: "Nou", icon: "➕" }].map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
