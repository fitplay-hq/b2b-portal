import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateWithoutBundleOrderItemsInput.schema';
import { BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemCreateWithoutBundleOrderItemsInputObjectSchema).array(), z.lazy(() => BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional()
}).strict();
export const BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleItemCreateNestedManyWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateNestedManyWithoutBundleOrderItemsInput>;
export const BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
