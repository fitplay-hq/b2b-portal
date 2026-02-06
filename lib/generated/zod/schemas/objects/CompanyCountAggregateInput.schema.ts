import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  address: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const CompanyCountAggregateInputObjectSchema: z.ZodType<Prisma.CompanyCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CompanyCountAggregateInputType>;
export const CompanyCountAggregateInputObjectZodSchema = makeSchema();
