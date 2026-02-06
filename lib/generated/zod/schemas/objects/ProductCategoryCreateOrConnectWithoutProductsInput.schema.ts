import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryCreateWithoutProductsInputObjectSchema as ProductCategoryCreateWithoutProductsInputObjectSchema } from './ProductCategoryCreateWithoutProductsInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema)])
}).strict();
export const ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateOrConnectWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateOrConnectWithoutProductsInput>;
export const ProductCategoryCreateOrConnectWithoutProductsInputObjectZodSchema = makeSchema();
