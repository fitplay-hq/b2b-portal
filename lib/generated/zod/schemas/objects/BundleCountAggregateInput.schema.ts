import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  price: z.literal(true).optional(),
  numberOfBundles: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const BundleCountAggregateInputObjectSchema: z.ZodType<Prisma.BundleCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleCountAggregateInputType>;
export const BundleCountAggregateInputObjectZodSchema = makeSchema();
