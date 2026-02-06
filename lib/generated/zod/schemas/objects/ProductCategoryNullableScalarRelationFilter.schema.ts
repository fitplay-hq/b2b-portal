import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional().nullable(),
  isNot: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional().nullable()
}).strict();
export const ProductCategoryNullableScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductCategoryNullableScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryNullableScalarRelationFilter>;
export const ProductCategoryNullableScalarRelationFilterObjectZodSchema = makeSchema();
