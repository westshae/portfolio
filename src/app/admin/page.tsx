"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/admin/login");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center text-foreground space-y-6">
        <div>Admin</div>
        <div>
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}


