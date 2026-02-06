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
export const OrderEmailMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderEmailMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailMaxOrderByAggregateInput>;
export const OrderEmailMaxOrderByAggregateInputObjectZodSchema = makeSchema();
