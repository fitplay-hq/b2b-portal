import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { BundleOrderByWithRelationInputObjectSchema as BundleOrderByWithRelationInputObjectSchema } from './BundleOrderByWithRelationInput.schema';
import { ProductOrderByWithRelationInputObjectSchema as ProductOrderByWithRelationInputObjectSchema } from './ProductOrderByWithRelationInput.schema';
import { BundleOrderItemOrderByRelationAggregateInputObjectSchema as BundleOrderItemOrderByRelationAggregateInputObjectSchema } from './BundleOrderItemOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bundleId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  bundleProductQuantity: SortOrderSchema.optional(),
  price: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  bundle: z.lazy(() => BundleOrderByWithRelationInputObjectSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BundleItemOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BundleItemOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleItemOrderByWithRelationInput>;
export const BundleItemOrderByWithRelationInputObjectZodSchema = makeSchema();
