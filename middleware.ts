import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔓 MUST be public for Chromium
  if (pathname === "/chromium-pack.tar") {
    return NextResponse.next();
  }

  // 🔒 Protect admin & client routes manually
  if (pathname.startsWith("/admin") || pathname.startsWith("/client")) {
    const hasSession =
      req.cookies.get("next-auth.session-token") ||
      req.cookies.get("__Secure-next-auth.session-token");

    if (!hasSession) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/client/:path*", "/chromium-pack.tar"],
};
