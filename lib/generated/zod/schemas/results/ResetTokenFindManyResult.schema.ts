import * as z from 'zod';
export const ResetTokenFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  identifier: z.string(),
  password: z.string(),
  token: z.string(),
  userId: z.string().optional(),
  userType: z.unknown().optional(),
  expires: z.date(),
  createdAt: z.date()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});