import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  clientId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const ClientProductCountAggregateInputObjectSchema: z.ZodType<Prisma.ClientProductCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductCountAggregateInputType>;
export const ClientProductCountAggregateInputObjectZodSchema = makeSchema();
