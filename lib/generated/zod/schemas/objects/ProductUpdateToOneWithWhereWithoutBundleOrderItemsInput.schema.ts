import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductUpdateWithoutBundleOrderItemsInputObjectSchema as ProductUpdateWithoutBundleOrderItemsInputObjectSchema } from './ProductUpdateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => ProductUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const ProductUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutBundleOrderItemsInput>;
export const ProductUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
