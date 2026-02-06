import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CompanyOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CompanyOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CompanyOrderByRelationAggregateInput>;
export const CompanyOrderByRelationAggregateInputObjectZodSchema = makeSchema();
