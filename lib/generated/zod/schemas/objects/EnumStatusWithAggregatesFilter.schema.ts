import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StatusSchema } from '../enums/Status.schema';
import { NestedEnumStatusWithAggregatesFilterObjectSchema as NestedEnumStatusWithAggregatesFilterObjectSchema } from './NestedEnumStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStatusFilterObjectSchema as NestedEnumStatusFilterObjectSchema } from './NestedEnumStatusFilter.schema'

const makeSchema = () => z.object({
  equals: StatusSchema.optional(),
  in: StatusSchema.array().optional(),
  notIn: StatusSchema.array().optional(),
  not: z.union([StatusSchema, z.lazy(() => NestedEnumStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterObjectSchema).optional()
}).strict();
export const EnumStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumStatusWithAggregatesFilter>;
export const EnumStatusWithAggregatesFilterObjectZodSchema = makeSchema();
