import * as z from 'zod';
export const LoginTokenFindUniqueResultSchema = z.nullable(z.object({
  id: z.string(),
  token: z.string(),
  identifier: z.string(),
  password: z.string(),
  userId: z.string().optional(),
  userType: z.unknown().optional(),
  createdAt: z.date(),
  expires: z.date()
}));