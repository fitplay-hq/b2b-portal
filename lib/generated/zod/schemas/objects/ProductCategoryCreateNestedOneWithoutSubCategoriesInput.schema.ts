import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateOrConnectWithoutSubCategoriesInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema).optional(),
  connect: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateNestedOneWithoutSubCategoriesInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateNestedOneWithoutSubCategoriesInput>;
export const ProductCategoryCreateNestedOneWithoutSubCategoriesInputObjectZodSchema = makeSchema();
