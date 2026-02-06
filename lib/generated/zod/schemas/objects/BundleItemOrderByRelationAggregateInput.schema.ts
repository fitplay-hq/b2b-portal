import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const BundleItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.BundleItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemOrderByRelationAggregateInput>;
export const BundleItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
