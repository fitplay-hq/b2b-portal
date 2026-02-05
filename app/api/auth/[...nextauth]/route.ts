// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { $Enums } from "@/lib/generated/prisma";

type UserRole = $Enums.Role;

export const auth: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // ✅ DEMO USER LOGIN (BYPASS DB)
if (
  credentials.email === "razorpay.demo@fitplaysolutions.com" &&
  credentials.password === "Test@2026"
) {
  console.log("🚀 Demo user login");

  return {
    id: "demo-client",
    name: "Demo Client",
    email: credentials.email,
    role: "CLIENT",
    companyId: "demo-company",
    companyName: "Demo Company",
    isDemo: true,
    isShowPrice: true,
  };
}

        // Special case: Email verification flow
        if (credentials.password === "EMAIL_VERIFIED") {
          console.log("🔓 Email verified login attempt for:", credentials.email);
          
          // Check which type of user this is
          const client = await prisma.client.findUnique({ 
            where: { email: credentials.email },
            include: { company: true }
          });
          if (client) {
            return {
              id: client.id,
              name: client.name,
              email: client.email,
              role: "CLIENT",
              companyId: client.companyID,
              companyName: client.company?.name || client.companyName || 'No Company',
              isShowPrice: client.isShowPrice
            };
          }

          const admin = await prisma.admin.findUnique({ where: { email: credentials.email } });
          if (admin) {
            return {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: "ADMIN",
            };
          }

          const systemUser = await prisma.systemUser.findUnique({ 
            where: { email: credentials.email },
            include: { role: true }
          });
          if (systemUser) {
            if (!systemUser.isActive) {
              throw new Error("Account is deactivated");
            }
            return {
              id: systemUser.id,
              name: systemUser.name,
              email: systemUser.email,
              role: "SYSTEM_USER",
              systemRole: systemUser.role.name,
              systemRoleId: systemUser.role.id,
            };
          }

          throw new Error("User not found");
        }
        // Special case: Email verification flow
        if (credentials.password === "EMAIL_VERIFIED") {
          console.log("🔓 Email verified login attempt for:", credentials.email);
          
          // Check which type of user this is
          const client = await prisma.client.findUnique({ 
            where: { email: credentials.email },
            include: { company: true }
          });
          if (client) {
            return {
              id: client.id,
              name: client.name,
              email: client.email,
              role: "CLIENT",
              companyId: client.companyID,
              companyName: client.company?.name || client.companyName || 'No Company',
              isShowPrice: client.isShowPrice
            };
          }

          const admin = await prisma.admin.findUnique({ where: { email: credentials.email } });
          if (admin) {
            return {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: "ADMIN",
            };
          }

          const systemUser = await prisma.systemUser.findUnique({ 
            where: { email: credentials.email },
            include: { role: true }
          });
          if (systemUser) {
            if (!systemUser.isActive) {
              throw new Error("Account is deactivated");
            }
            return {
              id: systemUser.id,
              name: systemUser.name,
              email: systemUser.email,
              role: "SYSTEM_USER",
              systemRole: systemUser.role.name,
              systemRoleId: systemUser.role.id,
            };
          }

          throw new Error("User not found");
        }

        // Special case: OTP verification flow
        if (credentials.password === "OTP_VERIFIED") {
          // Check which type of user this is
          const client = await prisma.client.findUnique({ 
            where: { email: credentials.email },
            include: { company: true }
          });
          if (client) {
            return {
              id: client.id,
              name: client.name,
              email: client.email,
              role: "CLIENT",
              companyId: client.companyID,
              companyName: client.company?.name || client.companyName || 'No Company',
              isShowPrice: client.isShowPrice
            };
          }

          const admin = await prisma.admin.findUnique({ where: { email: credentials.email } });
          if (admin) {
            return {
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: "ADMIN",
            };
          }

          const systemUser = await prisma.systemUser.findUnique({ 
            where: { email: credentials.email },
            include: { role: true }
          });
          if (systemUser) {
            if (!systemUser.isActive) {
              throw new Error("Account is deactivated");
            }
            return {
              id: systemUser.id,
              name: systemUser.name,
              email: systemUser.email,
              role: "SYSTEM_USER",
              systemRole: systemUser.role.name,
              systemRoleId: systemUser.role.id,
            };
          }

          throw new Error("User not found");
        }

        // Regular password-based authentication
        // 1. Check Admin
        const admin = await prisma.admin.findUnique({ where: { email: credentials.email } });
        if (admin) {
          const isValid = await compare(credentials.password, admin.password);
          if (!isValid) throw new Error("Invalid password");
          return {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: "ADMIN",
          };
        }

        // 2. Check Client
        const client = await prisma.client.findUnique({ 
          where: { email: credentials.email },
          include: { company: true }
        });
        if (client) {
          const isValid = await compare(credentials.password, client.password);
          if (!isValid) throw new Error("Invalid password");
          return {
            id: client.id,
            name: client.name,
            email: client.email,
            role: "CLIENT",
            companyId: client.companyID,
            companyName: client.company?.name || client.companyName || 'No Company',
            isShowPrice: client.isShowPrice
          };
        }

        // 3. Check SystemUser (Role-based management system)
        const systemUser = await prisma.systemUser.findUnique({ 
          where: { email: credentials.email },
          include: { role: true }
        });
        if (systemUser) {
          if (!systemUser.isActive) {
            throw new Error("Account is deactivated");
          }
          const isValid = await compare(credentials.password, systemUser.password);
          if (!isValid) throw new Error("Invalid password");
          return {
            id: systemUser.id,
            name: systemUser.name,
            email: systemUser.email,
            role: "SYSTEM_USER", // Use a new role type for system users
            systemRole: systemUser.role.name, // Include the actual role name
            systemRoleId: systemUser.role.id,
          };
        }

        throw new Error("No user found with this email");
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as { role: UserRole }).role;
        token.systemRole = (user as { systemRole?: string }).systemRole;
        token.systemRoleId = (user as { systemRoleId?: string }).systemRoleId;
        token.companyId = (user as { companyId?: string }).companyId;
        token.companyName = (user as { companyName?: string }).companyName;
        token.isDemo = (user as { isDemo?: boolean }).isDemo;
        token.isShowPrice = (user as { isShowPrice?: boolean }).isShowPrice;
        token.lastRefresh = Date.now();
        
        // Cache permissions in JWT token to avoid repeated database calls
        if ((user as { role: UserRole }).role === "SYSTEM_USER" && (user as { systemRoleId?: string }).systemRoleId) {
          try {
            const systemRole = await prisma.systemRole.findUnique({
              where: { id: (user as { systemRoleId: string }).systemRoleId },
              include: {
                permissions: {
                  select: {
                    id: true,
                    resource: true,
                    action: true,
                  }
                }
              }
            });
            token.permissions = systemRole?.permissions || [];
          } catch (error) {
            console.error("Error caching permissions in JWT:", error);
            token.permissions = [];
          }
        } else {
          token.permissions = []; // ADMIN or other roles
        }
      } else {
        // Refresh token data periodically (every 10 seconds for immediate updates)
        const shouldRefresh = !token.lastRefresh || Date.now() - (token.lastRefresh as number) > 10 * 1000;
        
        if (shouldRefresh && token.role === "CLIENT" && token.id) {
          try {
            console.log("🔄 Refreshing client token data for:", token.email);
            const client = await prisma.client.findUnique({
              where: { id: token.id as string },
              select: { 
                isShowPrice: true,
                name: true,
                companyID: true,
                company: { select: { name: true } }
              }
            });
            
            if (client) {
              console.log("✅ Client data refreshed - isShowPrice:", client.isShowPrice);
              token.isShowPrice = client.isShowPrice;
              token.name = client.name;
              token.companyId = client.companyID;
              token.companyName = client.company?.name || token.companyName;
              token.lastRefresh = Date.now();
            }
          } catch (error) {
            console.error("❌ Error refreshing client data:", error);
          }
        }
        
        // Refresh system user permissions periodically
        if (shouldRefresh && token.role === "SYSTEM_USER" && token.systemRoleId) {
          try {
            const systemRole = await prisma.systemRole.findUnique({
              where: { id: token.systemRoleId as string },
              include: {
                permissions: {
                  select: {
                    id: true,
                    resource: true,
                    action: true,
                  }
                }
              }
            });
            token.permissions = systemRole?.permissions || [];
            token.lastRefresh = Date.now();
          } catch (error) {
            console.error("Error refreshing permissions:", error);
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (token.role === "CLIENT") {
          console.log("📋 Building session for CLIENT - isShowPrice:", token.isShowPrice);
        }
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as UserRole,
          systemRole: token.systemRole as string,
          systemRoleId: token.systemRoleId as string,
          permissions: token.permissions as any[], // Use cached permissions from JWT
          companyId: token.companyId as string,
          companyName: token.companyName as string,
          isDemo: token.isDemo as boolean,
          isShowPrice: token.isShowPrice as boolean,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(auth);
export { handler as GET, handler as POST };
