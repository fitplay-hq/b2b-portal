import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleUncheckedCreateWithoutItemsInputObjectSchema: z.ZodType<Prisma.BundleUncheckedCreateWithoutItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUncheckedCreateWithoutItemsInput>;
export const BundleUncheckedCreateWithoutItemsInputObjectZodSchema = makeSchema();
