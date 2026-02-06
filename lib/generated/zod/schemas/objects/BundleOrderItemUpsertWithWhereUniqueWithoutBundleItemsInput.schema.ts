import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutBundleItemsInputObjectSchema as BundleOrderItemUpdateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUpdateWithoutBundleItemsInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutBundleItemsInput.schema';
import { BundleOrderItemCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateWithoutBundleItemsInput.schema';
import { BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedCreateWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleOrderItemUpdateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutBundleItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleOrderItemCreateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema)])
}).strict();
export const BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInput>;
export const BundleOrderItemUpsertWithWhereUniqueWithoutBundleItemsInputObjectZodSchema = makeSchema();
