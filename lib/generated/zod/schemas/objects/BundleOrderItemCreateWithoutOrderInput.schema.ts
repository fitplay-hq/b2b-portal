import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateNestedOneWithoutBundleOrderItemsInput.schema';
import { ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutBundleOrderItemsInput.schema';
import { BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema as BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema } from './BundleItemCreateNestedManyWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  quantity: z.number().int().optional(),
  price: z.number(),
  bundle: z.lazy(() => BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema),
  bundleItems: z.lazy(() => BundleItemCreateNestedManyWithoutBundleOrderItemsInputObjectSchema).optional()
}).strict();
export const BundleOrderItemCreateWithoutOrderInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateWithoutOrderInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateWithoutOrderInput>;
export const BundleOrderItemCreateWithoutOrderInputObjectZodSchema = makeSchema();
