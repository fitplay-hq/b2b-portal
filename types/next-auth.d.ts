// types/next-auth.d.ts or lib/auth.d.ts
import { DefaultSession } from "next-auth"
import { $Enums } from "@/lib/generated/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string
      email: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string // Make optional since it might not always be present
    email: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string
    email: string
  }
}