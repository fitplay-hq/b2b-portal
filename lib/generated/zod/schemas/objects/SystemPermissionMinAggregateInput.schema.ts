import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  resource: z.literal(true).optional(),
  action: z.literal(true).optional(),
  description: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SystemPermissionMinAggregateInputObjectSchema: z.ZodType<Prisma.SystemPermissionMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionMinAggregateInputType>;
export const SystemPermissionMinAggregateInputObjectZodSchema = makeSchema();
