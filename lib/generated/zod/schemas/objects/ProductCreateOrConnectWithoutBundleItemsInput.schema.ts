import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductWhereUniqueInputObjectSchema as ProductWhereUniqueInputObjectSchema } from './ProductWhereUniqueInput.schema';
import { ProductCreateWithoutBundleItemsInputObjectSchema as ProductCreateWithoutBundleItemsInputObjectSchema } from './ProductCreateWithoutBundleItemsInput.schema';
import { ProductUncheckedCreateWithoutBundleItemsInputObjectSchema as ProductUncheckedCreateWithoutBundleItemsInputObjectSchema } from './ProductUncheckedCreateWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => ProductWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => ProductCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => ProductUncheckedCreateWithoutBundleItemsInputObjectSchema)])
}).strict();
export const ProductCreateOrConnectWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCreateOrConnectWithoutBundleItemsInput>;
export const ProductCreateOrConnectWithoutBundleItemsInputObjectZodSchema = makeSchema();
