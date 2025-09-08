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

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Always protect admin APIs
  if (isAdminApi) {
    if (!token?.email || token.email.toLowerCase() !== adminEmail.toLowerCase()) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // If unauthenticated and going to /admin, push to /admin/login
  if (isAdminRoute && !token?.email) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // If authenticated but not admin and going to /admin, redirect away
  if (isAdminRoute && token?.email) {
    if (token.email.toLowerCase() !== adminEmail.toLowerCase()) {
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


