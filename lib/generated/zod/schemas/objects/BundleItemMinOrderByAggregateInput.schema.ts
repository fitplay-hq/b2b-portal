import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bundleId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  bundleProductQuantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const BundleItemMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleItemMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemMinOrderByAggregateInput>;
export const BundleItemMinOrderByAggregateInputObjectZodSchema = makeSchema();
