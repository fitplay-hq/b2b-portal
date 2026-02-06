import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ProductCategoryCountOrderByAggregateInputObjectSchema as ProductCategoryCountOrderByAggregateInputObjectSchema } from './ProductCategoryCountOrderByAggregateInput.schema';
import { ProductCategoryAvgOrderByAggregateInputObjectSchema as ProductCategoryAvgOrderByAggregateInputObjectSchema } from './ProductCategoryAvgOrderByAggregateInput.schema';
import { ProductCategoryMaxOrderByAggregateInputObjectSchema as ProductCategoryMaxOrderByAggregateInputObjectSchema } from './ProductCategoryMaxOrderByAggregateInput.schema';
import { ProductCategoryMinOrderByAggregateInputObjectSchema as ProductCategoryMinOrderByAggregateInputObjectSchema } from './ProductCategoryMinOrderByAggregateInput.schema';
import { ProductCategorySumOrderByAggregateInputObjectSchema as ProductCategorySumOrderByAggregateInputObjectSchema } from './ProductCategorySumOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  displayName: SortOrderSchema.optional(),
  description: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shortCode: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => ProductCategoryCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => ProductCategoryAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => ProductCategoryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => ProductCategoryMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => ProductCategorySumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const ProductCategoryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.ProductCategoryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryOrderByWithAggregationInput>;
export const ProductCategoryOrderByWithAggregationInputObjectZodSchema = makeSchema();
