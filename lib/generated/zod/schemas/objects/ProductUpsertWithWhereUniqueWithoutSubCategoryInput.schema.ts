import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutSubCategoryInputObjectSchema as ProductUpdateWithoutSubCategoryInputObjectSchema } from './ProductUpdateWithoutSubCategoryInput.schema';
import { ProductUncheckedUpdateWithoutSubCategoryInputObjectSchema as ProductUncheckedUpdateWithoutSubCategoryInputObjectSchema } from './ProductUncheckedUpdateWithoutSubCategoryInput.schema';
import { ProductCreateWithoutSubCategoryInputObjectSchema as ProductCreateWithoutSubCategoryInputObjectSchema } from './ProductCreateWithoutSubCategoryInput.schema';
import { ProductUncheckedCreateWithoutSubCategoryInputObjectSchema as ProductUncheckedCreateWithoutSubCategoryInputObjectSchema } from './ProductUncheckedCreateWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => ProductUpdateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutSubCategoryInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutSubCategoryInputObjectSchema)])
}).strict();
export const ProductUpsertWithWhereUniqueWithoutSubCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutSubCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutSubCategoryInput>;
export const ProductUpsertWithWhereUniqueWithoutSubCategoryInputObjectZodSchema = makeSchema();
