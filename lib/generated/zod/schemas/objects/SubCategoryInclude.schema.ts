import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryArgsObjectSchema as ProductCategoryArgsObjectSchema } from './ProductCategoryArgs.schema';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { SubCategoryCountOutputTypeArgsObjectSchema as SubCategoryCountOutputTypeArgsObjectSchema } from './SubCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  category: z.union([z.boolean(), z.lazy(() => ProductCategoryArgsObjectSchema)]).optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => SubCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SubCategoryIncludeObjectSchema: z.ZodType<Prisma.SubCategoryInclude> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryInclude>;
export const SubCategoryIncludeObjectZodSchema = makeSchema();
