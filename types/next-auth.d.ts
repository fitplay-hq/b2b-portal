// types/next-auth.d.ts or lib/auth.d.ts
import { DefaultSession } from "next-auth"
import { $Enums } from "@/lib/generated/prisma"

interface Permission {
  id: string
  resource: string
  action: string
  description?: string | null
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string
      email: string
      role?: $Enums.Role
      systemRole?: string // For SYSTEM_USER, this contains the actual role name
      systemRoleId?: string // For SYSTEM_USER, this contains the role ID
      permissions?: Permission[] // User's permissions
      companyId?: string // For CLIENT users
      companyName?: string // For CLIENT users
      isDemo?: boolean // Flag for demo accounts
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name?: string // Make optional since it might not always be present
    email: string
    role?: $Enums.Role
    systemRole?: string // For SYSTEM_USER, this contains the actual role name
    systemRoleId?: string // For SYSTEM_USER, this contains the role ID
    permissions?: Permission[] // User's permissions
    companyId?: string // For CLIENT users
    companyName?: string // For CLIENT users
    isDemo?: boolean // Flag for demo accounts
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    name?: string
    email: string
    role?: $Enums.Role
    systemRole?: string // For SYSTEM_USER, this contains the actual role name
    systemRoleId?: string // For SYSTEM_USER, this contains the role ID
    permissions?: Permission[] // User's permissions
    companyId?: string // For CLIENT users
    companyName?: string // For CLIENT users
    isDemo?: boolean // Flag for demo accounts
  }
}