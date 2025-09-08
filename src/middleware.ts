import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow NextAuth routes to proceed
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const adminEmail = process.env.ADMIN_EMAIL ?? "";

  // Protect /admin and /api/admin only
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (isProtected) {
    if (!token?.email || token.email.toLowerCase() !== adminEmail.toLowerCase()) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};


