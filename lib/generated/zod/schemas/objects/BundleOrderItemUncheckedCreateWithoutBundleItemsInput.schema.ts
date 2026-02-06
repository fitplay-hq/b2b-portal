import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number().int().optional(),
  price: z.number()
}).strict();
export const BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemUncheckedCreateWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemUncheckedCreateWithoutBundleItemsInput>;
export const BundleOrderItemUncheckedCreateWithoutBundleItemsInputObjectZodSchema = makeSchema();
