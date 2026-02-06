import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { ProductCategoryUpdateWithoutProductsInputObjectSchema as ProductCategoryUpdateWithoutProductsInputObjectSchema } from './ProductCategoryUpdateWithoutProductsInput.schema';
import { ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema as ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductCategoryWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductCategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema)])
}).strict();
export const ProductCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpdateToOneWithWhereWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpdateToOneWithWhereWithoutProductsInput>;
export const ProductCategoryUpdateToOneWithWhereWithoutProductsInputObjectZodSchema = makeSchema();
