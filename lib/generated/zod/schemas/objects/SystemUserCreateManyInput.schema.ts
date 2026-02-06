import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(100),
  email: z.string(),
  password: z.string(),
  isActive: z.boolean().optional(),
  roleId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SystemUserCreateManyInputObjectSchema: z.ZodType<Prisma.SystemUserCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserCreateManyInput>;
export const SystemUserCreateManyInputObjectZodSchema = makeSchema();
