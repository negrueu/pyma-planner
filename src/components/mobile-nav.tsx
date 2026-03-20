"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Acasă", icon: "◉" },
  { href: "/search", label: "Caută", icon: "⌕" },
  { href: "/calendar", label: "Calendar", icon: "▦" },
  { href: "/pipeline", label: "Pipeline", icon: "◫" },
  { href: "/event/new", label: "Nou", icon: "+" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`text-lg ${item.href === "/event/new" ? "bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-base" : ""}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
