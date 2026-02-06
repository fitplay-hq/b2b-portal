import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema'

const makeSchema = () => z.object({
  is: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional(),
  isNot: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional()
}).strict();
export const ProductCategoryScalarRelationFilterObjectSchema: z.ZodType<Prisma.ProductCategoryScalarRelationFilter> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryScalarRelationFilter>;
export const ProductCategoryScalarRelationFilterObjectZodSchema = makeSchema();
