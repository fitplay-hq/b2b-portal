import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutBundleItemsInputObjectSchema as ProductCreateWithoutBundleItemsInputObjectSchema } from './ProductCreateWithoutBundleItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleItemsInput.schema';
import { ProductCreateOrConnectWithoutBundleItemsInputObjectSchema as ProductCreateOrConnectWithoutBundleItemsInputObjectSchema } from './ProductCreateOrConnectWithoutBundleItemsInput.schema';
import { ProductUpsertWithoutBundleItemsInputObjectSchema as ProductUpsertWithoutBundleItemsInputObjectSchema } from './ProductUpsertWithoutBundleItemsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductUpdateToOneWithWhereWithoutBundleItemsInputObjectSchema as ProductUpdateToOneWithWhereWithoutBundleItemsInputObjectSchema } from './ProductUpdateToOneWithWhereWithoutBundleItemsInput.schema';
import { ProductUpdateWithoutBundleItemsInputObjectSchema as ProductUpdateWithoutBundleItemsInputObjectSchema } from './ProductUpdateWithoutBundleItemsInput.schema';
import { ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema as ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedUpdateWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutBundleItemsInputObjectSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutBundleItemsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional(),
  update: z.union([z.lazy(() => ProductUpdateToOneWithWhereWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUpdateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedUpdateWithoutBundleItemsInputObjectSchema)]).optional()
}).strict();
export const ProductUpdateOneRequiredWithoutBundleItemsNestedInputObjectSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutBundleItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductUpdateOneRequiredWithoutBundleItemsNestedInput>;
export const ProductUpdateOneRequiredWithoutBundleItemsNestedInputObjectZodSchema = makeSchema();
