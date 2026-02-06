import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCreateWithoutProductsInputObjectSchema as ProductCategoryCreateWithoutProductsInputObjectSchema } from './ProductCategoryCreateWithoutProductsInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductsInput.schema';
import { ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema as ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema } from './ProductCategoryCreateOrConnectWithoutProductsInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCategoryCreateNestedOneWithoutProductsInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateNestedOneWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateNestedOneWithoutProductsInput>;
export const ProductCategoryCreateNestedOneWithoutProductsInputObjectZodSchema = makeSchema();
