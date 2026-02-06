import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateNestedOneWithoutSubCategoriesInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  shortCode: z.string().max(10),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  category: z.lazy(() => ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema)
}).strict();
export const SubCategoryCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateWithoutProductsInput>;
export const SubCategoryCreateWithoutProductsInputObjectZodSchema = makeSchema();
