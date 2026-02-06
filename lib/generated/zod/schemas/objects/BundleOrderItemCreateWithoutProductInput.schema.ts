import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateNestedOneWithoutBundleOrderItemsInput.schema';
import { OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateNestedOneWithoutBundleOrderItemsInput.schema';
import { BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateNestedManyWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  quantity: z.number().int().optional(),
  price: z.number(),
  bundle: z.lazy(() => BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema),
  bundleItems: z.lazy(() => BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema).optional()
}).strict();
export const BundleOrderItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateWithoutProductInput>;
export const BundleOrderItemCreateWithoutProductInputObjectZodSchema = makeSchema();
