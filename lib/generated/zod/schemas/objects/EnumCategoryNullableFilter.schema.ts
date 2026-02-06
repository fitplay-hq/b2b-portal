import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CategorySchema } from '../enums/Category.schema';
import { NestedEnumCategoryNullableFilterObjectSchema as NestedEnumCategoryNullableFilterObjectSchema } from './NestedEnumCategoryNullableFilter.schema'

const makeSchema = () => z.object({
  equals: CategorySchema.optional().nullable(),
  in: CategorySchema.array().optional().nullable(),
  notIn: CategorySchema.array().optional().nullable(),
  not: z.union([CategorySchema, z.lazy(() => NestedEnumCategoryNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumCategoryNullableFilterObjectSchema: z.ZodType<Prisma.EnumCategoryNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumCategoryNullableFilter>;
export const EnumCategoryNullableFilterObjectZodSchema = makeSchema();
