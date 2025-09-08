"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "@/components/ui/navbar";

interface AuthShellProps {
  children: React.ReactNode;
}

// Wraps authenticated pages to provide global navigation and spacing
export function AuthShell({ children }: AuthShellProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLanding && <NavBar />}
      <div className={`flex-1 ${!isLanding ? "pb-16 md:pb-0" : ""}`}>
        {children}
      </div>
    </div>
  );
}


