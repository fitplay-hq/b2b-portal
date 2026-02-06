import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderOrderByWithRelationInputObjectSchema as OrderOrderByWithRelationInputObjectSchema } from './OrderOrderByWithRelationInput.schema';
import { BundleItemOrderByRelationAggregateInputObjectSchema as BundleItemOrderByRelationAggregateInputObjectSchema } from './BundleItemOrderByRelationAggregateInput.schema';
import { BundleOrderItemOrderByRelationAggregateInputObjectSchema as BundleOrderItemOrderByRelationAggregateInputObjectSchema } from './BundleOrderItemOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  orderId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  price: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  numberOfBundles: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputObjectSchema).optional(),
  items: z.lazy(() => BundleItemOrderByRelationAggregateInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const BundleOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.BundleOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.BundleOrderByWithRelationInput>;
export const BundleOrderByWithRelationInputObjectZodSchema = makeSchema();
