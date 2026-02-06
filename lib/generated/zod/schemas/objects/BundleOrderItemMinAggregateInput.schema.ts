import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  bundleId: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const BundleOrderItemMinAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemMinAggregateInputType>;
export const BundleOrderItemMinAggregateInputObjectZodSchema = makeSchema();
