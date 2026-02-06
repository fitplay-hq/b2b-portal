import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleId: z.string(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutBundleItemsInputObjectSchema).optional()
}).strict();
export const BundleItemUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemUncheckedCreateWithoutProductInput>;
export const BundleItemUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
