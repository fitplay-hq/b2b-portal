import { Geist, Geist_Mono } from "next/font/google";
import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/session-provider";
import { PermissionPreloader } from "@/components/permission-preloader";
import { ResourcePreloader, CriticalResourcePreloader } from "@/components/resource-preloader";
import { FastPermissionProvider } from "@/contexts/fast-permission-context";
import { CartProvider } from "@/contexts/cart-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fitplay B2B Portal"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <div className="min-h-screen bg-background">
          <CriticalResourcePreloader />
          <SessionProvider>
            <FastPermissionProvider>
              <CartProvider>
                <PermissionPreloader />
                <ResourcePreloader />
                {children}
              </CartProvider>
            </FastPermissionProvider>
          </SessionProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
