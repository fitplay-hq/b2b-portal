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

        // Special case: Razorpay demo client bypass
        if (credentials.email === "razorpay.demo@fitplaysolutions.com" && credentials.password === "test@2025") {
          console.log("🚀 Razorpay demo client bypass for:", credentials.email);
          
          // Find or create the Razorpay demo client
          let demoClient = await prisma.client.findUnique({ 
            where: { email: credentials.email },
            include: { company: true }
          });
          
          if (!demoClient) {
            // Create demo company first if it doesn't exist
            let demoCompany = await prisma.company.findFirst({
              where: { name: "Razorpay Demo Company" }
            });
            
            if (!demoCompany) {
              demoCompany = await prisma.company.create({
                data: {
                  name: "Razorpay Demo Company",
                  email: "demo@fitplaysolutions.com",
                  phone: "+91-9999999999",
                  address: "Demo Address, Mumbai, Maharashtra",
                  isActive: true
                }
              });
            }
            
            // Create demo client
            demoClient = await prisma.client.create({
              data: {
                name: "Razorpay Demo Client",
                email: credentials.email,
                password: "$2a$12$demo.password.hash", // Dummy hash since we're bypassing
                phone: "+91-9876543210",
                address: "Demo Client Address",
                companyID: demoCompany.id
              },
              include: { company: true }
            });
          }
          
          return {
            id: demoClient.id,
            name: demoClient.name,
            email: demoClient.email,
            role: "CLIENT",
            companyId: demoClient.companyID,
            companyName: demoClient.company?.name,
            isDemo: true, // Flag to identify demo accounts
          };
        }

        // Special case: Email verification flow
        if (credentials.password === "EMAIL_VERIFIED") {
          console.log("🔓 Email verified login attempt for:", credentials.email);
          
          // Check which type of user this is
          const client = await prisma.client.findUnique({ where: { email: credentials.email } });
          if (client) {
            return {
              id: client.id,
              name: client.name,
              email: client.email,
              role: "CLIENT",
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
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
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
                    description: true,
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
          permissions: token.permissions as any[], // Use cached permissions from JWT
          companyId: token.companyId as string,
          companyName: token.companyName as string,
          isDemo: token.isDemo as boolean,
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
