import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  address: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const CompanyMaxAggregateInputObjectSchema: z.ZodType<Prisma.CompanyMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.CompanyMaxAggregateInputType>;
export const CompanyMaxAggregateInputObjectZodSchema = makeSchema();
