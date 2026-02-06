import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SubCategoryOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SubCategoryOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryOrderByRelationAggregateInput>;
export const SubCategoryOrderByRelationAggregateInputObjectZodSchema = makeSchema();
