import * as z from 'zod';
export const BundleItemFindFirstResultSchema = z.nullable(z.object({
  id: z.string(),
  bundleId: z.string(),
  bundle: z.unknown(),
  product: z.unknown(),
  productId: z.string(),
  bundleProductQuantity: z.number().int(),
  price: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  bundleOrderItems: z.array(z.unknown())
}));