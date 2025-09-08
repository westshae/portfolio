"use client";

import { Button } from "@/components/ui/button";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect authenticated users to admin
  useEffect(() => {
    if (session && status === "authenticated") {
      router.push("/admin");
    }
  }, [session, status, router]);

  const handleAdminSignIn = async () => {
    await signIn("google", { callbackUrl: "/admin" });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Welcome</h1>
          </div>
          
          <div>
            <Button 
              onClick={handleAdminSignIn} 
              variant="outline"
              size="lg"
              className="px-8 py-3"
            >
              Sign in as admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
