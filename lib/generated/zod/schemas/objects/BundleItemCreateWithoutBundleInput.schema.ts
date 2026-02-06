import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { ProductCreateNestedOneWithoutBundleItemsInputObjectSchema as ProductCreateNestedOneWithoutBundleItemsInputObjectSchema } from './ProductCreateNestedOneWithoutBundleItemsInput.schema';
import { BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutBundleItemsInputObjectSchema),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema).optional()
}).strict();
export const BundleItemCreateWithoutBundleInputObjectSchema: z.ZodType<Prisma.BundleItemCreateWithoutBundleInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateWithoutBundleInput>;
export const BundleItemCreateWithoutBundleInputObjectZodSchema = makeSchema();
