import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { OrderCountOrderByAggregateInputObjectSchema as OrderCountOrderByAggregateInputObjectSchema } from './OrderCountOrderByAggregateInput.schema';
import { OrderAvgOrderByAggregateInputObjectSchema as OrderAvgOrderByAggregateInputObjectSchema } from './OrderAvgOrderByAggregateInput.schema';
import { OrderMaxOrderByAggregateInputObjectSchema as OrderMaxOrderByAggregateInputObjectSchema } from './OrderMaxOrderByAggregateInput.schema';
import { OrderMinOrderByAggregateInputObjectSchema as OrderMinOrderByAggregateInputObjectSchema } from './OrderMinOrderByAggregateInput.schema';
import { OrderSumOrderByAggregateInputObjectSchema as OrderSumOrderByAggregateInputObjectSchema } from './OrderSumOrderByAggregateInput.schema'

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
  _count: z.lazy(() => OrderCountOrderByAggregateInputObjectSchema).optional(),
  _avg: z.lazy(() => OrderAvgOrderByAggregateInputObjectSchema).optional(),
  _max: z.lazy(() => OrderMaxOrderByAggregateInputObjectSchema).optional(),
  _min: z.lazy(() => OrderMinOrderByAggregateInputObjectSchema).optional(),
  _sum: z.lazy(() => OrderSumOrderByAggregateInputObjectSchema).optional()
}).strict();
export const OrderOrderByWithAggregationInputObjectSchema: z.ZodType<Prisma.OrderOrderByWithAggregationInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderOrderByWithAggregationInput>;
export const OrderOrderByWithAggregationInputObjectZodSchema = makeSchema();
