import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { BundleOrderByWithRelationInputObjectSchema as BundleOrderByWithRelationInputObjectSchema } from './BundleOrderByWithRelationInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { BundleItemOrderByRelationAggregateInputObjectSchema as BundleItemOrderByRelationAggregateInputObjectSchema } from './BundleItemOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bundleId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  bundle: z.lazy(() => BundleOrderByWithRelationInputObjectSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  bundleItems: z.lazy(() => BundleItemOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BundleOrderItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BundleOrderItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderItemOrderByWithRelationInput>;
export const BundleOrderItemOrderByWithRelationInputObjectZodSchema = makeSchema();
