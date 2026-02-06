import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ReasonSchema } from '../enums/Reason.schema';
import { NestedEnumReasonNullableWithAggregatesFilterObjectSchema as NestedEnumReasonNullableWithAggregatesFilterObjectSchema } from './NestedEnumReasonNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumReasonNullableFilterObjectSchema as NestedEnumReasonNullableFilterObjectSchema } from './NestedEnumReasonNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ReasonSchema.optional().nullable(),
  in: ReasonSchema.array().optional().nullable(),
  notIn: ReasonSchema.array().optional().nullable(),
  not: z.union([ReasonSchema, z.lazy(() => NestedEnumReasonNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumReasonNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumReasonNullableFilterObjectSchema).optional()
}).strict();
export const EnumReasonNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumReasonNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumReasonNullableWithAggregatesFilter>;
export const EnumReasonNullableWithAggregatesFilterObjectZodSchema = makeSchema();
