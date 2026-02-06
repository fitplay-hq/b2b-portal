import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCategoryCreateWithoutProductsInputObjectSchema as ProductCategoryCreateWithoutProductsInputObjectSchema } from './ProductCategoryCreateWithoutProductsInput.schema';
import { ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema as ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedCreateWithoutProductsInput.schema';
import { ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema as ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema } from './ProductCategoryCreateOrConnectWithoutProductsInput.schema';
import { ProductCategoryUpsertWithoutProductsInputObjectSchema as ProductCategoryUpsertWithoutProductsInputObjectSchema } from './ProductCategoryUpsertWithoutProductsInput.schema';
import { ProductCategoryWhereInputObjectSchema as ProductCategoryWhereInputObjectSchema } from './ProductCategoryWhereInput.schema';
import { ProductCategoryWhereUniqueInputObjectSchema as ProductCategoryWhereUniqueInputObjectSchema } from './ProductCategoryWhereUniqueInput.schema';
import { ProductCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema as ProductCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema } from './ProductCategoryUpdateToOneWithWhereWithoutProductsInput.schema';
import { ProductCategoryUpdateWithoutProductsInputObjectSchema as ProductCategoryUpdateWithoutProductsInputObjectSchema } from './ProductCategoryUpdateWithoutProductsInput.schema';
import { ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema as ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema } from './ProductCategoryUncheckedUpdateWithoutProductsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCategoryCreateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCategoryCreateOrConnectWithoutProductsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductCategoryUpsertWithoutProductsInputObjectSchema).optional(),
  disconnect: z.union([z.boolean(), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  delete: z.union([z.boolean(), z.lazy(() => ProductCategoryWhereInputObjectSchema)]).optional(),
  connect: z.lazy(() => ProductCategoryWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductCategoryUpdateToOneWithWhereWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUpdateWithoutProductsInputObjectSchema), z.lazy(() => ProductCategoryUncheckedUpdateWithoutProductsInputObjectSchema)]).optional()
}).strict();
export const ProductCategoryUpdateOneWithoutProductsNestedInputObjectSchema: z.ZodType<Prisma.ProductCategoryUpdateOneWithoutProductsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUpdateOneWithoutProductsNestedInput>;
export const ProductCategoryUpdateOneWithoutProductsNestedInputObjectZodSchema = makeSchema();
