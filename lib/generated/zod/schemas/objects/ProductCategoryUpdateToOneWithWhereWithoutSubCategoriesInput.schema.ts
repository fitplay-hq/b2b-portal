import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema as ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUpdateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutSubCategoriesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema)])
}).strict();
export const ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInput>;
export const ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInputObjectZodSchema = makeSchema();
