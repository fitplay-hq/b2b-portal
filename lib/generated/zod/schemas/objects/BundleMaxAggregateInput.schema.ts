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
export const BundleMaxAggregateInputObjectSchema: z.ZodType<Prisma.BundleMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleMaxAggregateInputType>;
export const BundleMaxAggregateInputObjectZodSchema = makeSchema();
