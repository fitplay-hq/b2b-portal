import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  totalAmount: z.literal(true).optional(),
  consigneeName: z.literal(true).optional(),
  consigneePhone: z.literal(true).optional(),
  consigneeEmail: z.literal(true).optional(),
  consignmentNumber: z.literal(true).optional(),
  deliveryService: z.literal(true).optional(),
  deliveryAddress: z.literal(true).optional(),
  city: z.literal(true).optional(),
  state: z.literal(true).optional(),
  pincode: z.literal(true).optional(),
  modeOfDelivery: z.literal(true).optional(),
  requiredByDate: z.literal(true).optional(),
  deliveryReference: z.literal(true).optional(),
  packagingInstructions: z.literal(true).optional(),
  note: z.literal(true).optional(),
  shippingLabelUrl: z.literal(true).optional(),
  isMailSent: z.literal(true).optional(),
  status: z.literal(true).optional(),
  clientId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  numberOfBundles: z.literal(true).optional()
}).strict();
export const OrderMinAggregateInputObjectSchema: z.ZodType<Prisma.OrderMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.OrderMinAggregateInputType>;
export const OrderMinAggregateInputObjectZodSchema = makeSchema();
