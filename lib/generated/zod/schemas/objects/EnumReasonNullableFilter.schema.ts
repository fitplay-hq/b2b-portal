import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ReasonSchema } from '../enums/Reason.schema';
import { NestedEnumReasonNullableFilterObjectSchema as NestedEnumReasonNullableFilterObjectSchema } from './NestedEnumReasonNullableFilter.schema'

const makeSchema = () => z.object({
  equals: ReasonSchema.optional().nullable(),
  in: ReasonSchema.array().optional().nullable(),
  notIn: ReasonSchema.array().optional().nullable(),
  not: z.union([ReasonSchema, z.lazy(() => NestedEnumReasonNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumReasonNullableFilterObjectSchema: z.ZodType<Prisma.EnumReasonNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumReasonNullableFilter>;
export const EnumReasonNullableFilterObjectZodSchema = makeSchema();
