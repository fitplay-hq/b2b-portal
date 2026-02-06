import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutBundleOrderItemsInputObjectSchema as ProductCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutBundleOrderItemsInput>;
export const ProductCreateOrConnectWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
