import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedManyWithoutCategoryInputObjectSchema as ProductCreateNestedManyWithoutCategoryInputObjectSchema } from './ProductCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  displayName: z.string().max(100),
  description: z.string().max(255).optional().nullable(),
  shortCode: z.string().max(10),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductCreateNestedManyWithoutCategoryInputObjectSchema).optional()
}).strict();
export const ProductCategoryCreateWithoutSubCategoriesInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateWithoutSubCategoriesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateWithoutSubCategoriesInput>;
export const ProductCategoryCreateWithoutSubCategoriesInputObjectZodSchema = makeSchema();
