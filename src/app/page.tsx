"use client";

import { useSession } from "next-auth/react";

export default function LandingPage() {
  const { status } = useSession();

  // No redirect from landing; admin sign-in is on /admin

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
          
          <div />
        </div>
      </div>
    </div>
  );
}
