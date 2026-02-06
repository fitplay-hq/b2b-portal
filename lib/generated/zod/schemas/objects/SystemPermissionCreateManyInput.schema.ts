import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  resource: z.string().max(50),
  action: z.string().max(20),
  description: z.string().max(255).optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SystemPermissionCreateManyInputObjectSchema: z.ZodType<Prisma.SystemPermissionCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionCreateManyInput>;
export const SystemPermissionCreateManyInputObjectZodSchema = makeSchema();
