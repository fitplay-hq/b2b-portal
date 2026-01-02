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
          console.log("🔓 OTP verified login attempt for:", credentials.email);
          
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
    async jwt({ token, user }) {
      if (user) {
        console.log(`🔐 JWT BACKEND: Processing user login - Role: ${(user as { role: UserRole }).role}, Email: ${user.email}`);
        
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as { role: UserRole }).role;
        token.systemRole = (user as { systemRole?: string }).systemRole;
        token.systemRoleId = (user as { systemRoleId?: string }).systemRoleId;
        token.companyId = (user as { companyId?: string }).companyId;
        token.companyName = (user as { companyName?: string }).companyName;
        token.isDemo = (user as { isDemo?: boolean }).isDemo;
        
        // CRITICAL FIX: Only fetch permissions for SYSTEM_USER to avoid delays
        // ADMIN users don't need permissions from DB (they have everything)
        if ((user as { role: UserRole }).role === "SYSTEM_USER" && (user as { systemRoleId?: string }).systemRoleId) {
          console.log(`⚙️ JWT BACKEND: SYSTEM_USER detected, fetching permissions for role ID: ${(user as { systemRoleId?: string }).systemRoleId}`);
          try {
            // Fast permission fetch with minimal data
            const systemRole = await prisma.systemRole.findUnique({
              where: { id: (user as { systemRoleId: string }).systemRoleId },
              select: {
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
            console.log(`✅ JWT BACKEND: Loaded ${token.permissions.length} permissions for SYSTEM_USER`);
          } catch (error) {
            console.error("❌ JWT BACKEND: Error caching permissions in JWT:", error);
            token.permissions = []; // Fail safe - system will still work
          }
        } else {
          token.permissions = []; // ADMIN or CLIENT - no permissions needed
          console.log(`🔑 JWT BACKEND: ${(user as { role: UserRole }).role} user - no DB permissions needed`);
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log(`📄 SESSION BACKEND: Building session for role: ${token.role}`);
      if (token) {
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
        };
        console.log(`✅ SESSION BACKEND: Session built with ${session.user.permissions?.length || 0} permissions`);
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
