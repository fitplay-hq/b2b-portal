import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  clientId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ClientProductMinAggregateInputObjectSchema: z.ZodType<Prisma.ClientProductMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductMinAggregateInputType>;
export const ClientProductMinAggregateInputObjectZodSchema = makeSchema();
