import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateWithoutBundleOrderItemsInput.schema';
import { BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleItemCreateOrConnectWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateOrConnectWithoutBundleOrderItemsInput>;
export const BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
