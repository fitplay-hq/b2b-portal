import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  price: SortOrderSchema.optional(),
  numberOfBundles: SortOrderSchema.optional()
}).strict();
export const BundleSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleSumOrderByAggregateInput>;
export const BundleSumOrderByAggregateInputObjectZodSchema = makeSchema();
