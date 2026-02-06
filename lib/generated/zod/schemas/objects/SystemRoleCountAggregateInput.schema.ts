import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  description: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const SystemRoleCountAggregateInputObjectSchema: z.ZodType<Prisma.SystemRoleCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleCountAggregateInputType>;
export const SystemRoleCountAggregateInputObjectZodSchema = makeSchema();
