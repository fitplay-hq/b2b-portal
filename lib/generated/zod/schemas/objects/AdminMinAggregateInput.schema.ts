import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  email: z.literal(true).optional(),
  password: z.literal(true).optional(),
  role: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const AdminMinAggregateInputObjectSchema: z.ZodType<Prisma.AdminMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.AdminMinAggregateInputType>;
export const AdminMinAggregateInputObjectZodSchema = makeSchema();
