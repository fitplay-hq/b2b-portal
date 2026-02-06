import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { SubCategoryFindManySchema as SubCategoryFindManySchema } from '../findManySubCategory.schema';
import { ProductCategoryCountOutputTypeArgsObjectSchema as ProductCategoryCountOutputTypeArgsObjectSchema } from './ProductCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  displayName: z.boolean().optional(),
  description: z.boolean().optional(),
  shortCode: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  subCategories: z.union([z.boolean(), z.lazy(() => SubCategoryFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => ProductCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const ProductCategorySelectObjectSchema: z.ZodType<Prisma.ProductCategorySelect> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategorySelect>;
export const ProductCategorySelectObjectZodSchema = makeSchema();
