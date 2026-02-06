import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutSubCategoriesInput.schema';
import { ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema as ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema } from './ProductCategoryCreateOrConnectWithoutSubCategoriesInput.schema';
import { ProductCategoryUpsertWithoutSubCategoriesInputObjectSchema as ProductCategoryUpsertWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUpsertWithoutSubCategoriesInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInputObjectSchema as ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInput.schema';
import { ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema as ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUpdateWithoutSubCategoriesInput.schema';
import { ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema as ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutSubCategoriesInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutSubCategoriesInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCategoryCreateOrConnectWithoutSubCategoriesInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductCategoryUpsertWithoutSubCategoriesInputObjectSchema).optional(),
  connect: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductCategoryUpdateToOneWithWhereWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUpdateWithoutSubCategoriesInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutSubCategoriesInputObjectSchema)]).optional()
}).strict();
export const ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInput>;
export const ProductCategoryUpdateOneRequiredWithoutSubCategoriesNestedInputObjectZodSchema = makeSchema();
