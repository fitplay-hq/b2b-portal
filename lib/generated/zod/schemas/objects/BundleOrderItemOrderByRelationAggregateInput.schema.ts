import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const BundleOrderItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemOrderByRelationAggregateInput>;
export const BundleOrderItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
