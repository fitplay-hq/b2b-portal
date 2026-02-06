import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUncheckedCreateNestedManyWithoutCategoryInputObjectSchema as ProductUncheckedCreateNestedManyWithoutCategoryInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional().nullable(),
  shortCode: z.string(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutCategoryInputObjectSchema).optional()
}).strict();
export const ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema: z.ZodType<Prisma.ProductCategoryUncheckedCreateWithoutSubCategoriesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUncheckedCreateWithoutSubCategoriesInput>;
export const ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectZodSchema = makeSchema();
