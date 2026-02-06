import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryWhereInputObjectSchema as SubCategoryWhereInputObjectSchema } from './SubCategoryWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => SubCategoryWhereInputObjectSchema).optional()
}).strict();
export const ProductCategoryCountOutputTypeCountSubCategoriesArgsObjectSchema = makeSchema();
export const ProductCategoryCountOutputTypeCountSubCategoriesArgsObjectZodSchema = makeSchema();
