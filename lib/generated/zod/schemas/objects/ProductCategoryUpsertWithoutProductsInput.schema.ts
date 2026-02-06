import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryUpdateWithoutProductsInputObjectSchema as ProductCategoryUpdateWithoutProductsInputObjectSchema } from './ProductCategoryUpdateWithoutProductsInput.schema';
import { ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema as ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutProductsInput.schema';
import { ProductCategoryCreateWithoutProductsInputObjectSchema as ProductCategoryCreateWithoutProductsInputObjectSchema } from './ProductCategoryCreateWithoutProductsInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductsInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductCategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema)]),
  where: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional()
}).strict();
export const ProductCategoryUpsertWithoutProductsInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpsertWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpsertWithoutProductsInput>;
export const ProductCategoryUpsertWithoutProductsInputObjectZodSchema = makeSchema();
