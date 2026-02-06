import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  sku: SortOrderSchema.optional(),
  availableStock: SortOrderSchema.optional(),
  minStockThreshold: SortOrderSchema.optional(),
  inventoryUpdateReason: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  categories: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  subCategoryId: SortOrderSchema.optional(),
  avgRating: SortOrderSchema.optional(),
  noOfReviews: SortOrderSchema.optional(),
  brand: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ProductMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductMaxOrderByAggregateInput>;
export const ProductMaxOrderByAggregateInputObjectZodSchema = makeSchema();
