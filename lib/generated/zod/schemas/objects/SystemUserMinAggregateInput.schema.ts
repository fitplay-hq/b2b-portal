import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  email: z.literal(true).optional(),
  password: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  roleId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SystemUserMinAggregateInputObjectSchema: z.ZodType<Prisma.SystemUserMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserMinAggregateInputType>;
export const SystemUserMinAggregateInputObjectZodSchema = makeSchema();
