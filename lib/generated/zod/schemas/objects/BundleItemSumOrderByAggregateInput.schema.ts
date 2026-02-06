import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  bundleProductQuantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional()
}).strict();
export const BundleItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemSumOrderByAggregateInput>;
export const BundleItemSumOrderByAggregateInputObjectZodSchema = makeSchema();
