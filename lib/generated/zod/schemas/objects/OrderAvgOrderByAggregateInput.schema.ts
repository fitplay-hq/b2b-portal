import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  totalAmount: SortOrderSchema.optional(),
  numberOfBundles: SortOrderSchema.optional()
}).strict();
export const OrderAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderAvgOrderByAggregateInput>;
export const OrderAvgOrderByAggregateInputObjectZodSchema = makeSchema();
