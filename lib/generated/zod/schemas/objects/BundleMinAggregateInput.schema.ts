import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  price: z.literal(true).optional(),
  numberOfBundles: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const BundleMinAggregateInputObjectSchema: z.ZodType<Prisma.BundleMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleMinAggregateInputType>;
export const BundleMinAggregateInputObjectZodSchema = makeSchema();
