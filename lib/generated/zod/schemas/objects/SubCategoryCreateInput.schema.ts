import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateNestedOneWithoutSubCategoriesInput.schema';
import { ProductCreateNestedManyWithoutSubCategoryInputObjectSchema as ProductCreateNestedManyWithoutSubCategoryInputObjectSchema } from './ProductCreateNestedManyWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  shortCode: z.string().max(10),
  createdAt: z.coerce.date().optional(),
  category: z.lazy(() => ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema),
  products: z.lazy(() => ProductCreateNestedManyWithoutSubCategoryInputObjectSchema).optional()
}).strict();
export const SubCategoryCreateInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateInput>;
export const SubCategoryCreateInputObjectZodSchema = makeSchema();
