import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  description: z.string().max(255).optional().nullable(),
  isActive: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SystemRoleCreateManyInputObjectSchema: z.ZodType<Prisma.SystemRoleCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCreateManyInput>;
export const SystemRoleCreateManyInputObjectZodSchema = makeSchema();
