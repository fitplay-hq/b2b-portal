import * as z from 'zod';
export const SystemUserDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  isActive: z.boolean(),
  role: z.unknown(),
  roleId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
}));