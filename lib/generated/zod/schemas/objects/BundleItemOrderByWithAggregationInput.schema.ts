import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { BundleItemCountOrderByAggregateInputObjectSchema as BundleItemCountOrderByAggregateInputObjectSchema } from './BundleItemCountOrderByAggregateInput.schema';
import { BundleItemAvgOrderByAggregateInputObjectSchema as BundleItemAvgOrderByAggregateInputObjectSchema } from './BundleItemAvgOrderByAggregateInput.schema';
import { BundleItemMaxOrderByAggregateInputObjectSchema as BundleItemMaxOrderByAggregateInputObjectSchema } from './BundleItemMaxOrderByAggregateInput.schema';
import { BundleItemMinOrderByAggregateInputObjectSchema as BundleItemMinOrderByAggregateInputObjectSchema } from './BundleItemMinOrderByAggregateInput.schema';
import { BundleItemSumOrderByAggregateInputObjectSchema as BundleItemSumOrderByAggregateInputObjectSchema } from './BundleItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bundleId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  bundleProductQuantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => BundleItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BundleItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BundleItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BundleItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BundleItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BundleItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BundleItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemOrderByWithAggregationInput>;
export const BundleItemOrderByWithAggregationInputObjectZodSchema = makeSchema();
