import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './BundleCreateNestedOneWithoutBundleOrderItemsInput.schema';
import { OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './OrderCreateNestedOneWithoutBundleOrderItemsInput.schema';
import { ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema as ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema } from './ProductCreateNestedOneWithoutBundleOrderItemsInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  quantity: z.number().int().optional(),
  price: z.number(),
  bundle: z.lazy(() => BundleCreateNestedOneWithoutBundleOrderItemsInputObjectSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutBundleOrderItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutBundleOrderItemsInputObjectSchema)
}).strict();
export const BundleOrderItemCreateWithoutBundleItemsInputObjectSchema: z.ZodType<Prisma.BundleOrderItemCreateWithoutBundleItemsInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemCreateWithoutBundleItemsInput>;
export const BundleOrderItemCreateWithoutBundleItemsInputObjectZodSchema = makeSchema();
