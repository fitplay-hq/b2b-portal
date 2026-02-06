import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUpdateWithoutBundleOrderItemsInputObjectSchema as ProductUpdateWithoutBundleOrderItemsInputObjectSchema } from './ProductUpdateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutBundleOrderItemsInput.schema';
import { ProductCreateWithoutBundleOrderItemsInputObjectSchema as ProductCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutBundleOrderItemsInput>;
export const ProductUpsertWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
