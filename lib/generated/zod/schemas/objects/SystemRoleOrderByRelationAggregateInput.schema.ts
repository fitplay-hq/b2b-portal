import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const SystemRoleOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.SystemRoleOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemRoleOrderByRelationAggregateInput>;
export const SystemRoleOrderByRelationAggregateInputObjectZodSchema = makeSchema();
