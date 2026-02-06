import * as z from 'zod';
export const LoginTokenUpsertResultSchema = z.object({
  id: z.string(),
  token: z.string(),
  identifier: z.string(),
  password: z.string(),
  userId: z.string().optional(),
  userType: z.unknown().optional(),
  createdAt: z.date(),
  expires: z.date()
});