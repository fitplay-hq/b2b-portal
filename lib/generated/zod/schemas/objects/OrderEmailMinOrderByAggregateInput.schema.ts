import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  isSent: SortOrderSchema.optional(),
  sentAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const OrderEmailMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderEmailMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailMinOrderByAggregateInput>;
export const OrderEmailMinOrderByAggregateInputObjectZodSchema = makeSchema();
