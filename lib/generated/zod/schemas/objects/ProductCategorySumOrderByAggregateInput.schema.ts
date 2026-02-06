import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  sortOrder: SortOrderSchema.optional()
}).strict();
export const ProductCategorySumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategorySumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategorySumOrderByAggregateInput>;
export const ProductCategorySumOrderByAggregateInputObjectZodSchema = makeSchema();
