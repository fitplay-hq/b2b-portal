import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import withAuth from "next-auth/middleware";

function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ ABSOLUTELY REQUIRED: bypass auth for chromium binary
  if (pathname === "/chromium-pack.tar") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export default withAuth(middleware, {
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*",
  ],
};
