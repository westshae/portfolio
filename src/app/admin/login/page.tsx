"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-foreground">Admin access required</div>
        <Button
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}


