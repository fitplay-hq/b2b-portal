import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  bundleProductQuantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const BundleItemSumAggregateInputObjectSchema: z.ZodType<Prisma.BundleItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemSumAggregateInputType>;
export const BundleItemSumAggregateInputObjectZodSchema = makeSchema();
