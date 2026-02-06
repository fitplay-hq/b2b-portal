import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const SubCategoryCountOutputTypeCountProductsArgsObjectSchema = makeSchema();
export const SubCategoryCountOutputTypeCountProductsArgsObjectZodSchema = makeSchema();
