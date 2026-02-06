import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional()
}).strict();
export const BundleOrderItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemSumOrderByAggregateInput>;
export const BundleOrderItemSumOrderByAggregateInputObjectZodSchema = makeSchema();
