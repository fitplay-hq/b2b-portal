import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  displayName: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  shortCode: SortOrderSchema.optional(),
  isActive: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductCategoryMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategoryMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryMaxOrderByAggregateInput>;
export const ProductCategoryMaxOrderByAggregateInputObjectZodSchema = makeSchema();
