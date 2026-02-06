import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const BundleOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.BundleOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderByRelationAggregateInput>;
export const BundleOrderByRelationAggregateInputObjectZodSchema = makeSchema();
