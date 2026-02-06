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
export const SystemUserMaxAggregateInputObjectSchema: z.ZodType<Prisma.SystemUserMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserMaxAggregateInputType>;
export const SystemUserMaxAggregateInputObjectZodSchema = makeSchema();
