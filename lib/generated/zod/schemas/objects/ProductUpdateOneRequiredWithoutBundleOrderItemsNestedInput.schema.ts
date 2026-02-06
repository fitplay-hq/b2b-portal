import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutBundleOrderItemsInputObjectSchema as ProductCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { ProductUpsertWithoutBundleOrderItemsInputObjectSchema as ProductUpsertWithoutBundleOrderItemsInputObjectSchema } from './ProductUpsertWithoutBundleOrderItemsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema as ProductUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutBundleOrderItemsInput.schema';
import { ProductUpdateWithoutBundleOrderItemsInputObjectSchema as ProductUpdateWithoutBundleOrderItemsInputObjectSchema } from './ProductUpdateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutBundleOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInput>;
export const ProductUpdateOneRequiredWithoutBundleOrderItemsNestedInputObjectZodSchema = makeSchema();
