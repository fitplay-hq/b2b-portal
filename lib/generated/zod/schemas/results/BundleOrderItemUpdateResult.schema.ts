import * as z from 'zod';
export const BundleOrderItemUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  bundleId: z.string(),
  bundle: z.unknown(),
  order: z.unknown(),
  orderId: z.string(),
  product: z.unknown(),
  productId: z.string(),
  quantity: z.number().int(),
  price: z.number(),
  bundleItems: z.array(z.unknown())
}));