import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema as BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  items: z.lazy(() => BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleUncheckedCreateWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleUncheckedCreateWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUncheckedCreateWithoutBundleOrderItemsInput>;
export const BundleUncheckedCreateWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
