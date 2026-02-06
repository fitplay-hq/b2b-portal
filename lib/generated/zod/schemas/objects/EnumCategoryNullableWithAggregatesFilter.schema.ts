import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CategorySchema } from '../enums/Category.schema';
import { NestedEnumCategoryNullableWithAggregatesFilterObjectSchema as NestedEnumCategoryNullableWithAggregatesFilterObjectSchema } from './NestedEnumCategoryNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumCategoryNullableFilterObjectSchema as NestedEnumCategoryNullableFilterObjectSchema } from './NestedEnumCategoryNullableFilter.schema'

const makeSchema = () => z.object({
  equals: CategorySchema.optional().nullable(),
  in: CategorySchema.array().optional().nullable(),
  notIn: CategorySchema.array().optional().nullable(),
  not: z.union([CategorySchema, z.lazy(() => NestedEnumCategoryNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryNullableFilterObjectSchema).optional()
}).strict();
export const EnumCategoryNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumCategoryNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCategoryNullableWithAggregatesFilter>;
export const EnumCategoryNullableWithAggregatesFilterObjectZodSchema = makeSchema();
