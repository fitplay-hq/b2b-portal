// app/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import prisma from "@/lib/prisma";
import { $Enums } from "@/lib/generated/prisma";

type UserRole = $Enums.Role;

export const auth: AuthOptions = {
  providers: [
    // For hr/employee
    CredentialsProvider({
      id: "clients",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const client = await prisma.client.findUnique({
          where: { email: credentials.email },
        });

        if (!client) {
          console.log("Invalid password attempt for client:", credentials.email);
          throw new Error("No client found");
        }

        const isValid = await compare(credentials.password, client.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: client.id,
          name: client.name,
          email: client.email,
          role: client.role
        };
      },
    }),

    // Admin login provider
    CredentialsProvider({
      id: "admin",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter admin email" },
        password: { label: "Password", type: "password", placeholder: "Enter admin password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        if (credentials.email !== process.env.ADMIN_EMAIL) {
          throw new Error("Unauthorized admin email");
        }

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });

        if (!admin) {
          throw new Error("No admin found");
        }

        const isValid = await compare(credentials.password, admin.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        console.log("Admin logged in:", admin.email);
        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role ?? "ADMIN"
        };
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name as string, 
          email: token.email as string,
          role: token.role as $Enums.Role,
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === "development", 
};

const handler = NextAuth(auth)

export { handler as GET, handler as POST };
