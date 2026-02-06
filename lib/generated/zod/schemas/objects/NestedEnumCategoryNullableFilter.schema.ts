import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { CategorySchema } from '../enums/Category.schema'

const nestedenumcategorynullablefilterSchema = z.object({
  equals: CategorySchema.optional().nullable(),
  in: CategorySchema.array().optional().nullable(),
  notIn: CategorySchema.array().optional().nullable(),
  not: z.union([CategorySchema, z.lazy(() => NestedEnumCategoryNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumCategoryNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumCategoryNullableFilter> = nestedenumcategorynullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumCategoryNullableFilter>;
export const NestedEnumCategoryNullableFilterObjectZodSchema = nestedenumcategorynullablefilterSchema;
