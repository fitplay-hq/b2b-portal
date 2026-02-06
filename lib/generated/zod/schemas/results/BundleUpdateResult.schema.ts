import * as z from 'zod';
export const BundleUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  orderId: z.string().optional(),
  order: z.unknown().optional(),
  price: z.number().optional(),
  numberOfBundles: z.number().int().optional(),
  items: z.array(z.unknown()),
  bundleOrderItems: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
}));