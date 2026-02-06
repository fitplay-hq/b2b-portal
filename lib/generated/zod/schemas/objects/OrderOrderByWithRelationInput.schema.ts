import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { ClientOrderByWithRelationInputObjectSchema as ClientOrderByWithRelationInputObjectSchema } from './ClientOrderByWithRelationInput.schema';
import { OrderItemOrderByRelationAggregateInputObjectSchema as OrderItemOrderByRelationAggregateInputObjectSchema } from './OrderItemOrderByRelationAggregateInput.schema';
import { OrderEmailOrderByRelationAggregateInputObjectSchema as OrderEmailOrderByRelationAggregateInputObjectSchema } from './OrderEmailOrderByRelationAggregateInput.schema';
import { BundleOrderItemOrderByRelationAggregateInputObjectSchema as BundleOrderItemOrderByRelationAggregateInputObjectSchema } from './BundleOrderItemOrderByRelationAggregateInput.schema';
import { BundleOrderByRelationAggregateInputObjectSchema as BundleOrderByRelationAggregateInputObjectSchema } from './BundleOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  totalAmount: SortOrderSchema.optional(),
  consigneeName: SortOrderSchema.optional(),
  consigneePhone: SortOrderSchema.optional(),
  consigneeEmail: SortOrderSchema.optional(),
  consignmentNumber: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  deliveryService: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  deliveryAddress: SortOrderSchema.optional(),
  city: SortOrderSchema.optional(),
  state: SortOrderSchema.optional(),
  pincode: SortOrderSchema.optional(),
  modeOfDelivery: SortOrderSchema.optional(),
  requiredByDate: SortOrderSchema.optional(),
  deliveryReference: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  packagingInstructions: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  shippingLabelUrl: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  isMailSent: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  clientId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  numberOfBundles: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  client: z.lazy(() => ClientOrderByWithRelationInputObjectSchema).optional(),
  orderItems: z.lazy(() => OrderItemOrderByRelationAggregateInputObjectSchema).optional(),
  emails: z.lazy(() => OrderEmailOrderByRelationAggregateInputObjectSchema).optional(),
  bundleOrderItems: z.lazy(() => BundleOrderItemOrderByRelationAggregateInputObjectSchema).optional(),
  bundles: z.lazy(() => BundleOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const OrderOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.OrderOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderOrderByWithRelationInput>;
export const OrderOrderByWithRelationInputObjectZodSchema = makeSchema();
