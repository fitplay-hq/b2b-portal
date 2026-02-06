import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number(),
  bundleItems: z.lazy(() => BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInputObjectSchema).optional()
}).strict();
export const BundleOrderItemUncheckedCreateWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedCreateWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedCreateWithoutBundleInput>;
export const BundleOrderItemUncheckedCreateWithoutBundleInputObjectZodSchema = makeSchema();
