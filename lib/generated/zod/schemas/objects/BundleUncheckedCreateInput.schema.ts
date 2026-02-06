import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema as BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateNestedManyWithoutBundleInput.schema';
import { BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  orderId: z.string().optional().nullable(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  items: z.lazy(() => BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleUncheckedCreateInputObjectSchema: z.ZodType<Prisma.BundleUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUncheckedCreateInput>;
export const BundleUncheckedCreateInputObjectZodSchema = makeSchema();
