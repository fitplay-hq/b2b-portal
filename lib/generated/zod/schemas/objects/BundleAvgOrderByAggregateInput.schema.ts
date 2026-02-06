import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  price: SortOrderSchema.optional(),
  numberOfBundles: SortOrderSchema.optional()
}).strict();
export const BundleAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleAvgOrderByAggregateInput>;
export const BundleAvgOrderByAggregateInputObjectZodSchema = makeSchema();
