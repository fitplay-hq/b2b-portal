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
import { signOut } from "next-auth/react";
import NavItems from "./nav-items";

interface LayoutProps {
  children: ReactNode;
  title: string;
  isClient: boolean;
}

export default function Layout({ children, title, isClient }: LayoutProps) {
  const user = {
    id: "1",
    email: "client@acmecorp.com",
    name: "John Smith",
    role: "client",
    company: "ACME Corporation",
  };

  return (
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.company || user?.role}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="px-2 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {user?.company && (
                <div className="px-2 py-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-muted-foreground">{user.company}</p>
                  </div>
                </div>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
