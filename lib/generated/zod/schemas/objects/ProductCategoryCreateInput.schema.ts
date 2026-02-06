import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedManyWithoutCategoryInputObjectSchema as ProductCreateNestedManyWithoutCategoryInputObjectSchema } from './ProductCreateNestedManyWithoutCategoryInput.schema';
import { SubCategoryCreateNestedManyWithoutCategoryInputObjectSchema as SubCategoryCreateNestedManyWithoutCategoryInputObjectSchema } from './SubCategoryCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  displayName: z.string().max(100),
  description: z.string().max(255).optional().nullable(),
  shortCode: z.string().max(10),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCategoryInputObjectSchema).optional(),
  subCategories: z.lazy(() => SubCategoryCreateNestedManyWithoutCategoryInputObjectSchema).optional()
}).strict();
export const ProductCategoryCreateInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateInput>;
export const ProductCategoryCreateInputObjectZodSchema = makeSchema();
