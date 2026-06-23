import { NextResponse, type NextRequest } from "next/server";

const authenticatedRoutes = ["/home", "/profile", "/complete-profile"];
const guestOnlyRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get("bizships-authenticated")?.value === "true";
  const pathname = request.nextUrl.pathname;
  const isAuthenticatedRoute = authenticatedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isGuestOnlyRoute = guestOnlyRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isAuthenticated && isAuthenticatedRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/profile/:path*",
    "/complete-profile/:path*",
    "/login",
    "/signup",
  ],
};
