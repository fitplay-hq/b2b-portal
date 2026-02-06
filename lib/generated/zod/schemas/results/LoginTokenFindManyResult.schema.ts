import * as z from 'zod';
export const LoginTokenFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  token: z.string(),
  identifier: z.string(),
  password: z.string(),
  userId: z.string().optional(),
  userType: z.unknown().optional(),
  createdAt: z.date(),
  expires: z.date()
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