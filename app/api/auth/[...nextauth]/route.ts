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
        const client = await prisma.client.findUnique({ where: { email: credentials.email } });
        if (client) {
          const isValid = await compare(credentials.password, client.password);
          if (!isValid) throw new Error("Invalid password");
          return {
            id: client.id,
            name: client.name,
            email: client.email,
            role: "CLIENT",
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
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as { role: UserRole }).role;
        token.systemRole = (user as { systemRole?: string }).systemRole;
        token.systemRoleId = (user as { systemRoleId?: string }).systemRoleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as UserRole,
          systemRole: token.systemRole as string,
          systemRoleId: token.systemRoleId as string,
        };

        // Load permissions for SYSTEM_USER
        if (token.role === "SYSTEM_USER" && token.systemRoleId) {
          try {
            const systemRole = await prisma.systemRole.findUnique({
              where: { id: token.systemRoleId as string },
              include: {
                permissions: {
                  select: {
                    id: true,
                    resource: true,
                    action: true,
                    description: true,
                  }
                }
              }
            });

            if (systemRole) {
              session.user.permissions = systemRole.permissions;
            }
          } catch (error) {
            console.error("Error loading user permissions:", error);
            session.user.permissions = [];
          }
        }
        // ADMIN gets all permissions (or we can set them explicitly)
        else if (token.role === "ADMIN") {
          session.user.permissions = []; // Will be handled as special case in permission checks
        }
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
