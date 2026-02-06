import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInputObjectSchema as BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInputObjectSchema } from './BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number(),
  bundleItems: z.lazy(() => BundleItemUncheckedCreateNestedManyWithoutBundleOrderItemsInputObjectSchema).optional()
}).strict();
export const BundleOrderItemUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedCreateInput>;
export const BundleOrderItemUncheckedCreateInputObjectZodSchema = makeSchema();
