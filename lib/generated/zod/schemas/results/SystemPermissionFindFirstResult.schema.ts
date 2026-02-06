import * as z from 'zod';
export const SystemPermissionFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  resource: z.string(),
  action: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  roles: z.array(z.unknown())
}));