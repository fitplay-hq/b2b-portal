import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductUpdateWithoutBundleItemsInputObjectSchema as ProductUpdateWithoutBundleItemsInputObjectSchema } from './ProductUpdateWithoutBundleItemsInput.schema';
import { ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema as ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutBundleItemsInput.schema';
import { ProductCreateWithoutBundleItemsInputObjectSchema as ProductCreateWithoutBundleItemsInputObjectSchema } from './ProductCreateWithoutBundleItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleItemsInput.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => ProductUpdateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => ProductCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleItemsInputObjectSchema)]),
  where: z.lazy(() => ProductWhereInputObjectSchema).optional()
}).strict();
export const ProductUpsertWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.ProductUpsertWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpsertWithoutBundleItemsInput>;
export const ProductUpsertWithoutBundleItemsInputObjectZodSchema = makeSchema();
