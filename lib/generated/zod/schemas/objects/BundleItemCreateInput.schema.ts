import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateNestedOneWithoutItemsInputObjectSchema as BundleCreateNestedOneWithoutItemsInputObjectSchema } from './BundleCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutBundleItemsInputObjectSchema as ProductCreateNestedOneWithoutBundleItemsInputObjectSchema } from './ProductCreateNestedOneWithoutBundleItemsInput.schema';
import { BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema as BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema } from './BundleOrderItemCreateNestedManyWithoutBundleItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  bundleProductQuantity: z.number().int().optional(),
  price: z.number(),
  createdAt: z.coerce.date().optional(),
  bundle: z.lazy(() => BundleCreateNestedOneWithoutItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutBundleItemsInputObjectSchema),
  bundleOrderItems: z.lazy(() => BundleOrderItemCreateNestedManyWithoutBundleItemsInputObjectSchema).optional()
}).strict();
export const BundleItemCreateInputObjectSchema: z.ZodType<Prisma.BundleItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemCreateInput>;
export const BundleItemCreateInputObjectZodSchema = makeSchema();
