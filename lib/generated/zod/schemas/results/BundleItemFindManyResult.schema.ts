import * as z from 'zod';
export const BundleItemFindManyResultSchema = z.object({
  data: z.array(z.object({
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