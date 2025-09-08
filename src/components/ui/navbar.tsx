"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, FileText, Shield, Mail } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
  { href: "/projects", label: "Projects", icon: <Folder className="h-5 w-5" /> },
  { href: "/articles", label: "Articles", icon: <FileText className="h-5 w-5" /> },
  { href: "/cv", label: "CV", icon: <FileText className="h-5 w-5" /> },
  { href: "https://forms.gle/2iMEK5WovtyDKWSS9", label: "Contact", icon: <Mail className="h-5 w-5" /> },
  { href: "/admin", label: "Admin", icon: <Shield className="h-5 w-5" /> },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 h-14 overflow-x-auto justify-end">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  active ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}


