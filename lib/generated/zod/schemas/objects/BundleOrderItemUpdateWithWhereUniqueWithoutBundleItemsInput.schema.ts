import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemWhereUniqueInputObjectSchema as BundleOrderItemWhereUniqueInputObjectSchema } from './BundleOrderItemWhereUniqueInput.schema';
import { BundleOrderItemUpdateWithoutBundleItemsInputObjectSchema as BundleOrderItemUpdateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUpdateWithoutBundleItemsInput.schema';
import { BundleOrderItemUncheckedUpdateWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedUpdateWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedUpdateWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => BundleOrderItemWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => BundleOrderItemUpdateWithoutBundleItemsInputObjectSchema), z.lazy(() => BundleOrderItemUncheckedUpdateWithoutBundleItemsInputObjectSchema)])
}).strict();
export const BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInput>;
export const BundleOrderItemUpdateWithWhereUniqueWithoutBundleItemsInputObjectZodSchema = makeSchema();
