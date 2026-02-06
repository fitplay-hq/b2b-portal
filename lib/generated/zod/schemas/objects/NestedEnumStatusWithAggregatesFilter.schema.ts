import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { StatusSchema } from '../enums/Status.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumStatusFilterObjectSchema as NestedEnumStatusFilterObjectSchema } from './NestedEnumStatusFilter.schema'

const nestedenumstatuswithaggregatesfilterSchema = z.object({
  equals: StatusSchema.optional(),
  in: StatusSchema.array().optional(),
  notIn: StatusSchema.array().optional(),
  not: z.union([StatusSchema, z.lazy(() => NestedEnumStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter> = nestedenumstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumStatusWithAggregatesFilter>;
export const NestedEnumStatusWithAggregatesFilterObjectZodSchema = nestedenumstatuswithaggregatesfilterSchema;
