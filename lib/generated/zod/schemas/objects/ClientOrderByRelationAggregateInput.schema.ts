import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ClientOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ClientOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientOrderByRelationAggregateInput>;
export const ClientOrderByRelationAggregateInputObjectZodSchema = makeSchema();
