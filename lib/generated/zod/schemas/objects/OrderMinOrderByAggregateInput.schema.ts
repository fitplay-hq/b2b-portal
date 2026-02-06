import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  totalAmount: SortOrderSchema.optional(),
  consigneeName: SortOrderSchema.optional(),
  consigneePhone: SortOrderSchema.optional(),
  consigneeEmail: SortOrderSchema.optional(),
  consignmentNumber: SortOrderSchema.optional(),
  deliveryService: SortOrderSchema.optional(),
  deliveryAddress: SortOrderSchema.optional(),
  city: SortOrderSchema.optional(),
  state: SortOrderSchema.optional(),
  pincode: SortOrderSchema.optional(),
  modeOfDelivery: SortOrderSchema.optional(),
  requiredByDate: SortOrderSchema.optional(),
  deliveryReference: SortOrderSchema.optional(),
  packagingInstructions: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  shippingLabelUrl: SortOrderSchema.optional(),
  isMailSent: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  clientId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  numberOfBundles: SortOrderSchema.optional()
}).strict();
export const OrderMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderMinOrderByAggregateInput>;
export const OrderMinOrderByAggregateInputObjectZodSchema = makeSchema();
