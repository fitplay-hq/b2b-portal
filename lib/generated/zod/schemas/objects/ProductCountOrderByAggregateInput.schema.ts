import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  images: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  sku: SortOrderSchema.optional(),
  availableStock: SortOrderSchema.optional(),
  minStockThreshold: SortOrderSchema.optional(),
  inventoryUpdateReason: SortOrderSchema.optional(),
  inventoryLogs: SortOrderSchema.optional(),
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
export const ProductCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCountOrderByAggregateInput>;
export const ProductCountOrderByAggregateInputObjectZodSchema = makeSchema();
