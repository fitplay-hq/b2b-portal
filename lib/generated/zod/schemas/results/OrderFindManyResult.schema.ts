import * as z from 'zod';
export const OrderFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  totalAmount: z.number(),
  consigneeName: z.string(),
  consigneePhone: z.string(),
  consigneeEmail: z.string(),
  consignmentNumber: z.string().optional(),
  deliveryService: z.string().optional(),
  deliveryAddress: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  modeOfDelivery: z.unknown(),
  requiredByDate: z.date(),
  deliveryReference: z.string().optional(),
  packagingInstructions: z.string().optional(),
  note: z.string().optional(),
  shippingLabelUrl: z.string().optional(),
  isMailSent: z.boolean(),
  status: z.unknown(),
  client: z.unknown().optional(),
  clientId: z.string().optional(),
  orderItems: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
  emails: z.array(z.unknown()),
  bundleOrderItems: z.array(z.unknown()),
  bundles: z.array(z.unknown()),
  numberOfBundles: z.number().int().optional()
})),
  pagination: z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean()
})
});