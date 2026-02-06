import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const OrderItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.OrderItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemOrderByRelationAggregateInput>;
export const OrderItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
