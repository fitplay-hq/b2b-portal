import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { SubCategoryFindManySchema as SubCategoryFindManySchema } from '../findManySubCategory.schema';
import { ProductCategoryCountOutputTypeArgsObjectSchema as ProductCategoryCountOutputTypeArgsObjectSchema } from './ProductCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  subCategories: z.union([z.boolean(), z.lazy(() => SubCategoryFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductCategoryIncludeObjectSchema: z.ZodType<Prisma.ProductCategoryInclude> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryInclude>;
export const ProductCategoryIncludeObjectZodSchema = makeSchema();
