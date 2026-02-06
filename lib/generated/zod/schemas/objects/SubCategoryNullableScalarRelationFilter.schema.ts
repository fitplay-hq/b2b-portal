import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => SubCategoryWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => SubCategoryWhereInputObjectSchema).optional().nullable()
}).strict();
export const SubCategoryNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.SubCategoryNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryNullableScalarRelationFilter>;
export const SubCategoryNullableScalarRelationFilterObjectZodSchema = makeSchema();
