import * as z from 'zod';
export const SystemRoleDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  permissions: z.array(z.unknown()),
  users: z.array(z.unknown())
}));