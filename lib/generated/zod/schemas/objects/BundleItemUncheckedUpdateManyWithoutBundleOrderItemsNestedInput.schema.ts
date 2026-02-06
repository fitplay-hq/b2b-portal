import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateWithoutBundleOrderItemsInput.schema';
import { BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleOrderItemsInput.schema';
import { BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateOrConnectWithoutBundleOrderItemsInput.schema';
import { BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema as BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInput.schema';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema as BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInput.schema';
import { BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInputObjectSchema as BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInput.schema';
import { BundleItemScalarWhereInputObjectSchema as BundleItemScalarWhereInputObjectSchema } from './BundleItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemCreateWithoutBundleOrderItemsInputObjectSchema).array(), z.lazy(() => BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemCreateOrConnectWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleItemWhereUniqueInputObjectSchema), z.lazy(() => BundleItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUpdateManyWithWhereWithoutBundleOrderItemsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleItemScalarWhereInputObjectSchema), z.lazy(() => BundleItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectSchema: z.ZodType<Prisma.BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInput>;
export const BundleItemUncheckedUpdateManyWithoutBundleOrderItemsNestedInputObjectZodSchema = makeSchema();
