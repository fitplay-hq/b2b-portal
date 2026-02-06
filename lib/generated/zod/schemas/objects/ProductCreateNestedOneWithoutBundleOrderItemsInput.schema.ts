import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutBundleOrderItemsInputObjectSchema as ProductCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateWithoutBundleOrderItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutBundleOrderItemsInput>;
export const ProductCreateNestedOneWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
