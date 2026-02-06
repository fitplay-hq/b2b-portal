import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SubCategoryCountOrderByAggregateInputObjectSchema as SubCategoryCountOrderByAggregateInputObjectSchema } from './SubCategoryCountOrderByAggregateInput.schema';
import { SubCategoryMaxOrderByAggregateInputObjectSchema as SubCategoryMaxOrderByAggregateInputObjectSchema } from './SubCategoryMaxOrderByAggregateInput.schema';
import { SubCategoryMinOrderByAggregateInputObjectSchema as SubCategoryMinOrderByAggregateInputObjectSchema } from './SubCategoryMinOrderByAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  shortCode: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  _count: z.lazy(() => SubCategoryCountOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => SubCategoryMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => SubCategoryMinOrderByAggregateInputObjectSchema).optional()
}).strict();
export const SubCategoryOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.SubCategoryOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryOrderByWithAggregationInput>;
export const SubCategoryOrderByWithAggregationInputObjectZodSchema = makeSchema();
