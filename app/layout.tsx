"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "@/components/session-provider";
import { PermissionPreloader } from "@/components/permission-preloader";
import { ResourcePreloader, CriticalResourcePreloader } from "@/components/resource-preloader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
            <PermissionPreloader />
            <ResourcePreloader />
            {children}
          </SessionProvider>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
