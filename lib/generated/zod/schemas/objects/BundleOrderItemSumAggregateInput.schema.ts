import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  price: z.literal(true).optional()
}).strict();
export const BundleOrderItemSumAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemSumAggregateInputType>;
export const BundleOrderItemSumAggregateInputObjectZodSchema = makeSchema();
