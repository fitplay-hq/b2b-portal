import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Package, LogOut, User, Building } from "lucide-react";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import NavItems from "./nav-items";
import AccountInfo from "./account-info";

interface LayoutProps {
  children: ReactNode;
  title: string;
  isClient: boolean;
}

export default function Layout({ children, title, isClient }: LayoutProps) {
  return (
    <SessionProvider>
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-semibold">Fitplay B2B</h1>
                <p className="text-sm text-muted-foreground">
                  {isClient ? "Client Portal" : "Admin Dashboard"}
                </p>
              </div>
            </div>

            <NavItems isClient={isClient} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
            <h2 className="text-lg font-semibold">{title}</h2>

            <AccountInfo />
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
