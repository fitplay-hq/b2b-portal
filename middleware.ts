import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ Allow Chromium binary download without auth
    if (pathname === "/chromium-pack.tar") {
      return NextResponse.next();
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    /*
      Protect ONLY these routes.
      Everything else (including /chromium-pack.tar) is public.
    */
    "/admin/:path*",
    "/client/:path*",
  ],
};
