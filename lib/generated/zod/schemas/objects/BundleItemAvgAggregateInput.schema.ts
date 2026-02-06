import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  bundleProductQuantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const BundleItemAvgAggregateInputObjectSchema: z.ZodType<Prisma.BundleItemAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemAvgAggregateInputType>;
export const BundleItemAvgAggregateInputObjectZodSchema = makeSchema();
