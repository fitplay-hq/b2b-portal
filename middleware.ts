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

  return NextResponse.next();
}

// Apply middleware only to client pages
export const config = {
  matcher: ["/client/:path*"],
};
