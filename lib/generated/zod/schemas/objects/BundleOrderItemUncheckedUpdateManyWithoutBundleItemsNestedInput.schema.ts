import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateWithoutBundleItemsInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleItemsInput.schema';
import { BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateOrConnectWithoutBundleItemsInput.schema';
import { BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInputObjectSchema as BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInput.schema';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInputObjectSchema as BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInput.schema';
import { BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInputObjectSchema as BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInput.schema';
import { BundleOrderItemScalarWhereInputObjectSchema as BundleOrderItemScalarWhereInputObjectSchema } from './BundleOrderItemScalarWhereInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemCreateWithoutBundleItemsInputObjectSchema).array(), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema).array()]).optional(),
  connectOrCreate: z.union([z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemCreateOrConnectWithoutBundleItemsInputObjectSchema).array()]).optional(),
  upsert: z.union([z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInputObjectSchema).array()]).optional(),
  set: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  disconnect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  delete: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  connect: z.union([z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema), z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema).array()]).optional(),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInputObjectSchema).array()]).optional(),
  updateMany: z.union([z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUpdateManyWithWhereWithoutBundleItemsInputObjectSchema).array()]).optional(),
  deleteMany: z.union([z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema), z.lazy(() => BundleOrderItemScalarWhereInputObjectSchema).array()]).optional()
}).strict();
export const BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInput>;
export const BundleOrderItemUncheckedUpdateManyWithoutBundleItemsNestedInputObjectZodSchema = makeSchema();
