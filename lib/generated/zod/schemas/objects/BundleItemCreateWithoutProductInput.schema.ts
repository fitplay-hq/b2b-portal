import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateNestedOneWithoutItemsInputObjectSchema as BundleCreateNestedOneWithoutItemsInputObjectSchema } from './BundleCreateNestedOneWithoutItemsInput.schema';
import { BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bundle: z.lazy(() => BundleCreateNestedOneWithoutItemsInputObjectSchema),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema).optional()
}).strict();
export const BundleItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateWithoutProductInput>;
export const BundleItemCreateWithoutProductInputObjectZodSchema = makeSchema();
