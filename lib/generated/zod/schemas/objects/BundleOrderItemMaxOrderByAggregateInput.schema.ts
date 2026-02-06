import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bundleId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional()
}).strict();
export const BundleOrderItemMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemMaxOrderByAggregateInput>;
export const BundleOrderItemMaxOrderByAggregateInputObjectZodSchema = makeSchema();
