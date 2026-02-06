import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCountOutputTypeCountProductsArgsObjectSchema as ProductCategoryCountOutputTypeCountProductsArgsObjectSchema } from './ProductCategoryCountOutputTypeCountProductsArgs.schema';
import { ProductCategoryCountOutputTypeCountSubCategoriesArgsObjectSchema as ProductCategoryCountOutputTypeCountSubCategoriesArgsObjectSchema } from './ProductCategoryCountOutputTypeCountSubCategoriesArgs.schema'

const makeSchema = () => z.object({
  products: z.union([z.boolean(), z.lazy(() => ProductCategoryCountOutputTypeCountProductsArgsObjectSchema)]).optional(),
  subCategories: z.union([z.boolean(), z.lazy(() => ProductCategoryCountOutputTypeCountSubCategoriesArgsObjectSchema)]).optional()
}).strict();
export const ProductCategoryCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ProductCategoryCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCountOutputTypeSelect>;
export const ProductCategoryCountOutputTypeSelectObjectZodSchema = makeSchema();
