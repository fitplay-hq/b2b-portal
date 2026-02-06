import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutBundleItemsInputObjectSchema as ProductUpdateWithoutBundleItemsInputObjectSchema } from './ProductUpdateWithoutBundleItemsInput.schema';
import { ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema as ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutBundleItemsInput>;
export const ProductUpdateToOneWithWhereWithoutBundleItemsInputObjectZodSchema = makeSchema();
