import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  bundleId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  bundleProductQuantity: z.literal(true).optional(),
  price: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const BundleItemMinAggregateInputObjectSchema: z.ZodType<Prisma.BundleItemMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemMinAggregateInputType>;
export const BundleItemMinAggregateInputObjectZodSchema = makeSchema();
