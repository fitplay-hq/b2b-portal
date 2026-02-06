import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  price: SortOrderSchema.optional(),
  availableStock: SortOrderSchema.optional(),
  minStockThreshold: SortOrderSchema.optional(),
  avgRating: SortOrderSchema.optional(),
  noOfReviews: SortOrderSchema.optional()
}).strict();
export const ProductAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductAvgOrderByAggregateInput>;
export const ProductAvgOrderByAggregateInputObjectZodSchema = makeSchema();
