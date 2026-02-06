import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema as ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUpdateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutSubCategoriesInput.schema';
import { ProductCategoryCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema)]),
  where: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional()
}).strict();
export const ProductCategoryUpsertWithoutSubCategoriesInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpsertWithoutSubCategoriesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpsertWithoutSubCategoriesInput>;
export const ProductCategoryUpsertWithoutSubCategoriesInputObjectZodSchema = makeSchema();
