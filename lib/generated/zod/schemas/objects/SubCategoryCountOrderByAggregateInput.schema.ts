import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  shortCode: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const SubCategoryCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.SubCategoryCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCountOrderByAggregateInput>;
export const SubCategoryCountOrderByAggregateInputObjectZodSchema = makeSchema();
