"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { LogOut, User } from "lucide-react";

interface AuthHeaderProps {
  hideIdentityLabel?: boolean;
}

export function AuthHeader({ hideIdentityLabel = false }: AuthHeaderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h1 className="text-xl font-semibold text-foreground">ProperHabits</h1>
        <div className="w-8 h-8 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <h1 className="text-xl font-semibold text-foreground">ProperHabits</h1>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleProfileClick}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <User className="h-4 w-4" />
            {!hideIdentityLabel && (
              <span className="hidden sm:inline">{session.user.name || session.user.email}</span>
            )}
          </button>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
