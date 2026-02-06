import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryArgsObjectSchema as ProductCategoryArgsObjectSchema } from './ProductCategoryArgs.schema';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { SubCategoryCountOutputTypeArgsObjectSchema as SubCategoryCountOutputTypeArgsObjectSchema } from './SubCategoryCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  shortCode: z.boolean().optional(),
  category: z.union([z.boolean(), z.lazy(() => ProductCategoryArgsObjectSchema)]).optional(),
  products: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  _count: z.union([z.boolean(), z.lazy(() => SubCategoryCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const SubCategorySelectObjectSchema: z.ZodType<Prisma.SubCategorySelect> = makeSchema() as unknown as z.ZodType<Prisma.SubCategorySelect>;
export const SubCategorySelectObjectZodSchema = makeSchema();
