import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateWithoutBundleItemsInputObjectSchema as ProductCreateWithoutBundleItemsInputObjectSchema } from './ProductCreateWithoutBundleItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleItemsInput.schema';
import { ProductCreateOrConnectWithoutBundleItemsInputObjectSchema as ProductCreateOrConnectWithoutBundleItemsInputObjectSchema } from './ProductCreateOrConnectWithoutBundleItemsInput.schema';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => ProductCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleItemsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutBundleItemsInputObjectSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputObjectSchema).optional()
}).strict();
export const ProductCreateNestedOneWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateNestedOneWithoutBundleItemsInput>;
export const ProductCreateNestedOneWithoutBundleItemsInputObjectZodSchema = makeSchema();
