import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductCountOrderByAggregateInputObjectSchema as ProductCountOrderByAggregateInputObjectSchema } from './ProductCountOrderByAggregateInput.schema';
import { ProductAvgOrderByAggregateInputObjectSchema as ProductAvgOrderByAggregateInputObjectSchema } from './ProductAvgOrderByAggregateInput.schema';
import { ProductMaxOrderByAggregateInputObjectSchema as ProductMaxOrderByAggregateInputObjectSchema } from './ProductMaxOrderByAggregateInput.schema';
import { ProductMinOrderByAggregateInputObjectSchema as ProductMinOrderByAggregateInputObjectSchema } from './ProductMinOrderByAggregateInput.schema';
import { ProductSumOrderByAggregateInputObjectSchema as ProductSumOrderByAggregateInputObjectSchema } from './ProductSumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  images: SortOrderSchema.optional(),
  price: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sku: SortOrderSchema.optional(),
  availableStock: SortOrderSchema.optional(),
  minStockThreshold: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  inventoryUpdateReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  inventoryLogs: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  categories: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  categoryId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  subCategoryId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  avgRating: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  noOfReviews: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  brand: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProductOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductOrderByWithAggregationInput>;
export const ProductOrderByWithAggregationInputObjectZodSchema = makeSchema();
