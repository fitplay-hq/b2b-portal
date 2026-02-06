import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleItemCreateNestedManyWithoutBundleInputObjectSchema as BundleItemCreateNestedManyWithoutBundleInputObjectSchema } from './BundleItemCreateNestedManyWithoutBundleInput.schema';
import { BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema as BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutBundleInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  price: z.number().optional().nullable(),
  numberOfBundles: z.number().int().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  items: z.lazy(() => BundleItemCreateNestedManyWithoutBundleInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutBundleInputObjectSchema).optional()
}).strict();
export const BundleCreateWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleCreateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleCreateWithoutOrderInput>;
export const BundleCreateWithoutOrderInputObjectZodSchema = makeSchema();
