import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ReasonSchema } from '../enums/Reason.schema'

const nestedenumreasonnullablefilterSchema = z.object({
  equals: ReasonSchema.optional().nullable(),
  in: ReasonSchema.array().optional().nullable(),
  notIn: ReasonSchema.array().optional().nullable(),
  not: z.union([ReasonSchema, z.lazy(() => NestedEnumReasonNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumReasonNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumReasonNullableFilter> = nestedenumreasonnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumReasonNullableFilter>;
export const NestedEnumReasonNullableFilterObjectZodSchema = nestedenumreasonnullablefilterSchema;
