import type { NextRequest } from "next/server";
import { NextResponse as Response } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminSession = request.cookies.get("admin_session");
  const isAuthenticated = adminSession?.value === "authenticated";

  const isAuthRoute = pathname.startsWith("/auth/login");
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  // Define public routes that don't require authentication
  const isPublicAsset = pathname === "/";
  const isPublicApiGet =
    (pathname.startsWith("/api/blogs") ||
      pathname.startsWith("/api/projects") ||
      pathname.startsWith("/api/profile")) &&
    request.method === "GET";
  const isPublicContactApi =
    pathname === "/api/contact" && request.method === "POST";

  // If authenticated, redirect from login to admin
  if (isAuthenticated && isAuthRoute) {
    return Response.redirect(new URL("/admin", request.url));
  }

  // If not authenticated, protect admin and necessary API routes
  if (
    !isAuthenticated &&
    !isAuthRoute &&
    !isPublicAsset &&
    !isPublicApiGet &&
    !isPublicContactApi &&
    !isApiAuthRoute
  ) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/")) {
      return Response.redirect(new URL("/auth/login", request.url));
    }
  }

  return Response.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};