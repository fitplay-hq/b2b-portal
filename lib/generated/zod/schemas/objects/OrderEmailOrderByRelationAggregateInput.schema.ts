import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const OrderEmailOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.OrderEmailOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderEmailOrderByRelationAggregateInput>;
export const OrderEmailOrderByRelationAggregateInputObjectZodSchema = makeSchema();
