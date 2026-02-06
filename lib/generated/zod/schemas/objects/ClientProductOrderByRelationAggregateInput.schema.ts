import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ClientProductOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ClientProductOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ClientProductOrderByRelationAggregateInput>;
export const ClientProductOrderByRelationAggregateInputObjectZodSchema = makeSchema();
