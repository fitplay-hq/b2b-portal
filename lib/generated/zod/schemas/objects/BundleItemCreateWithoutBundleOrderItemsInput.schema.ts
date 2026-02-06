import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateNestedOneWithoutItemsInputObjectSchema as BundleCreateNestedOneWithoutItemsInputObjectSchema } from './BundleCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutBundleItemsInputObjectSchema as ProductCreateNestedOneWithoutBundleItemsInputObjectSchema } from './ProductCreateNestedOneWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  bundle: z.lazy(() => BundleCreateNestedOneWithoutItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutBundleItemsInputObjectSchema)
}).strict();
export const BundleItemCreateWithoutBundleOrderItemsInputObjectSchema: z.ZodType<Prisma.BundleItemCreateWithoutBundleOrderItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateWithoutBundleOrderItemsInput>;
export const BundleItemCreateWithoutBundleOrderItemsInputObjectZodSchema = makeSchema();
