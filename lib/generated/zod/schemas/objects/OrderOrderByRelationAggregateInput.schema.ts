import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const OrderOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.OrderOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderOrderByRelationAggregateInput>;
export const OrderOrderByRelationAggregateInputObjectZodSchema = makeSchema();
