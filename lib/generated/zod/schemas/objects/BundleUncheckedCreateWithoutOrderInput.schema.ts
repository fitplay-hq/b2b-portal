import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema as BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema } from './BundleItemUncheckedCreateNestedManyWithoutBundleInput.schema';
import { BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema as BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema } from './BundleOrderItemUncheckedCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  items: z.lazy(() => BundleItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemUncheckedCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleUncheckedCreateWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleUncheckedCreateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleUncheckedCreateWithoutOrderInput>;
export const BundleUncheckedCreateWithoutOrderInputObjectZodSchema = makeSchema();
