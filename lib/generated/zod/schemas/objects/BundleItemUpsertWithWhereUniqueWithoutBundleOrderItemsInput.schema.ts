import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithoutBundleOrderItemsInputObjectSchema as BundleItemUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUpdateWithoutBundleOrderItemsInput.schema';
import { BundleItemUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedUpdateWithoutBundleOrderItemsInput.schema';
import { BundleItemCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateWithoutBundleOrderItemsInput.schema';
import { BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedCreateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => BundleItemUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)]),
  create: z.union([z.lazy(() => BundleItemCreateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUncheckedCreateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInput>;
export const BundleItemUpsertWithWhereUniqueWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
