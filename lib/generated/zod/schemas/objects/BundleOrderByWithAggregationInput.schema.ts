import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { BundleCountOrderByAggregateInputObjectSchema as BundleCountOrderByAggregateInputObjectSchema } from './BundleCountOrderByAggregateInput.schema';
import { BundleAvgOrderByAggregateInputObjectSchema as BundleAvgOrderByAggregateInputObjectSchema } from './BundleAvgOrderByAggregateInput.schema';
import { BundleMaxOrderByAggregateInputObjectSchema as BundleMaxOrderByAggregateInputObjectSchema } from './BundleMaxOrderByAggregateInput.schema';
import { BundleMinOrderByAggregateInputObjectSchema as BundleMinOrderByAggregateInputObjectSchema } from './BundleMinOrderByAggregateInput.schema';
import { BundleSumOrderByAggregateInputObjectSchema as BundleSumOrderByAggregateInputObjectSchema } from './BundleSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  price: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  numberOfBundles: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => BundleCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => BundleAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => BundleMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => BundleMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => BundleSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const BundleOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.BundleOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderByWithAggregationInput>;
export const BundleOrderByWithAggregationInputObjectZodSchema = makeSchema();
