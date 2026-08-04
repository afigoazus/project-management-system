import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better-Auth stores session tokens in standard cookies
  const sessionToken =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isAuthenticated = Boolean(sessionToken?.value);

  // Protected routes that require authentication
  const isProtectedRoute =
    pathname.startsWith("/workspaces") || pathname.startsWith("/projects");

  // Auth routes and landing page that logged-in users shouldn't access
  const isAuthRoute =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  // 1. If not authenticated and trying to access protected routes -> redirect to /login
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated and trying to access landing page, login, or register -> redirect to /workspaces
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/workspaces", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
