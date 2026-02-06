import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SystemUserOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SystemUserOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemUserOrderByRelationAggregateInput>;
export const SystemUserOrderByRelationAggregateInputObjectZodSchema = makeSchema();
