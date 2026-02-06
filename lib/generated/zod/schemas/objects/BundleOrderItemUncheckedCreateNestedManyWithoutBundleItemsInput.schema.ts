import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateWithoutBundleItemsInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleItemsInput.schema';
import { BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutBundleItemsInput.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutBundleItemsInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInput>;
export const BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectZodSchema = makeSchema();
