import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { BundleOrderItemCountOrderByAggregateInputObjectSchema as BundleOrderItemCountOrderByAggregateInputObjectSchema } from './BundleOrderItemCountOrderByAggregateInput.schema';
import { BundleOrderItemAvgOrderByAggregateInputObjectSchema as BundleOrderItemAvgOrderByAggregateInputObjectSchema } from './BundleOrderItemAvgOrderByAggregateInput.schema';
import { BundleOrderItemMaxOrderByAggregateInputObjectSchema as BundleOrderItemMaxOrderByAggregateInputObjectSchema } from './BundleOrderItemMaxOrderByAggregateInput.schema';
import { BundleOrderItemMinOrderByAggregateInputObjectSchema as BundleOrderItemMinOrderByAggregateInputObjectSchema } from './BundleOrderItemMinOrderByAggregateInput.schema';
import { BundleOrderItemSumOrderByAggregateInputObjectSchema as BundleOrderItemSumOrderByAggregateInputObjectSchema } from './BundleOrderItemSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bundleId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  _count: z.lazy(() => BundleOrderItemCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BundleOrderItemAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BundleOrderItemMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BundleOrderItemMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BundleOrderItemSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BundleOrderItemOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BundleOrderItemOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemOrderByWithAggregationInput>;
export const BundleOrderItemOrderByWithAggregationInputObjectZodSchema = makeSchema();
