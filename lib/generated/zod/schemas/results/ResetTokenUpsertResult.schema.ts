import * as z from 'zod';
export const ResetTokenUpsertResultSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  password: z.string(),
  token: z.string(),
  userId: z.string().optional(),
  userType: z.unknown().optional(),
  expires: z.date(),
  createdAt: z.date()
});