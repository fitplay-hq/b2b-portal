import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const ProductCategoryAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategoryAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryAvgOrderByAggregateInput>;
export const ProductCategoryAvgOrderByAggregateInputObjectZodSchema = makeSchema();
