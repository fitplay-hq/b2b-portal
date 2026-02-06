import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemWhereUniqueInputObjectSchema as BundleItemWhereUniqueInputObjectSchema } from './BundleItemWhereUniqueInput.schema';
import { BundleItemUpdateWithoutBundleOrderItemsInputObjectSchema as BundleItemUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUpdateWithoutBundleOrderItemsInput.schema';
import { BundleItemUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedUpdateWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleItemUpdateWithoutBundleOrderItemsInputObjectSchema), z.lazy(() => BundleItemUncheckedUpdateWithoutBundleOrderItemsInputObjectSchema)])
}).strict();
export const BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInput>;
export const BundleItemUpdateWithWhereUniqueWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
