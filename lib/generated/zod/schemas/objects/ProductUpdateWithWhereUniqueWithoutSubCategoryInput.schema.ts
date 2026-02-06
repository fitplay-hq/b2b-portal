import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateWithoutSubCategoryInputObjectSchema as ProductUpdateWithoutSubCategoryInputObjectSchema } from './ProductUpdateWithoutSubCategoryInput.schema';
import { ProductUncheckedUpdateWithoutSubCategoryInputObjectSchema as ProductUncheckedUpdateWithoutSubCategoryInputObjectSchema } from './ProductUncheckedUpdateWithoutSubCategoryInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => ProductUpdateWithoutSubCategoryInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutSubCategoryInputObjectSchema)])
}).strict();
export const ProductUpdateWithWhereUniqueWithoutSubCategoryInputObjectSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutSubCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutSubCategoryInput>;
export const ProductUpdateWithWhereUniqueWithoutSubCategoryInputObjectZodSchema = makeSchema();
