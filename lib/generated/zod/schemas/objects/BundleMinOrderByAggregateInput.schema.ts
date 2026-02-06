import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  numberOfBundles: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const BundleMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BundleMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleMinOrderByAggregateInput>;
export const BundleMinOrderByAggregateInputObjectZodSchema = makeSchema();
