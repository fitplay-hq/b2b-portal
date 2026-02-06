import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateWithoutBundleItemsInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema)])
}).strict();
export const BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateOrConnectWithoutBundleItemsInput>;
export const BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectZodSchema = makeSchema();
