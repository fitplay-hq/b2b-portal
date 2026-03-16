import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const DEMO_EMAIL = "demo.github@fitplaysolutions.com";


const DEMO_BLOCKED_ROUTES = [
  "/client/analytics",
  "/client/orders",
  "/client/inventory-logs",
  "/client/cart",
  "/client/checkout"
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const pathname = req.nextUrl.pathname;

  // 1. Handle Admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", encodeURI(req.url));
      return NextResponse.redirect(url);
    }

    if (token.role !== "ADMIN") {
      // If user is logged in but not an admin, redirect to their respective dashboard
      // or a general forbidden page. For now, redirecting to login as requested (or their dashboard if they are a client)
      if (token.role === "CLIENT") {
        return NextResponse.redirect(new URL("/client/products", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  }

  // 2. Handle Client routes (existing logic)
  if (pathname.startsWith("/client")) {
    if (!token?.email) {
      return NextResponse.next();
    }

    const isDemoUser = token.email.toLowerCase() === DEMO_EMAIL;

    if (
      isDemoUser &&
      DEMO_BLOCKED_ROUTES.some((route) =>
        pathname.startsWith(route)
      )
    ) {
      return NextResponse.redirect(
        new URL("/client/products", req.url)
      );
    }
  }

  return NextResponse.next();
}

// Apply middleware to both admin and client pages
export const config = {
  matcher: ["/client/:path*", "/admin/:path*"],
};
