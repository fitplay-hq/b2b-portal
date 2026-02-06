import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  productId: z.string(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema).optional()
}).strict();
export const BundleItemUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BundleItemUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUncheckedCreateInput>;
export const BundleItemUncheckedCreateInputObjectZodSchema = makeSchema();
