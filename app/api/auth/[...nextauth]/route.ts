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
