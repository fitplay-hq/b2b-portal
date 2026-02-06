import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutSubCategoriesInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema)])
}).strict();
export const ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateOrConnectWithoutSubCategoriesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateOrConnectWithoutSubCategoriesInput>;
export const ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectZodSchema = makeSchema();
