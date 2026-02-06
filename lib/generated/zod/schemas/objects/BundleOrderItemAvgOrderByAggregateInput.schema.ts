import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional()
}).strict();
export const BundleOrderItemAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemAvgOrderByAggregateInput>;
export const BundleOrderItemAvgOrderByAggregateInputObjectZodSchema = makeSchema();
