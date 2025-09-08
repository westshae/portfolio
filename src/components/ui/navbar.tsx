"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, ListChecks, User } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/habits", label: "Habits", icon: <ListChecks className="h-5 w-5" /> },
  { href: "/growth", label: "Growth", icon: <BarChart2 className="h-5 w-5" /> },
  { href: "/summary", label: "Summary", icon: <Home className="h-5 w-5" /> },
  { href: "/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top nav for desktop */}
      <nav className="hidden md:block sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 h-14">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                    active ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom nav for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/80 backdrop-blur">
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-3 text-xs transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}


