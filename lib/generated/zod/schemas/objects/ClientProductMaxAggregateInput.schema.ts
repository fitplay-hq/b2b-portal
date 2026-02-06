import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  clientId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ClientProductMaxAggregateInputObjectSchema: z.ZodType<Prisma.ClientProductMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductMaxAggregateInputType>;
export const ClientProductMaxAggregateInputObjectZodSchema = makeSchema();
