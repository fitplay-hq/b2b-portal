import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SystemPermissionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SystemPermissionOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemPermissionOrderByRelationAggregateInput>;
export const SystemPermissionOrderByRelationAggregateInputObjectZodSchema = makeSchema();
