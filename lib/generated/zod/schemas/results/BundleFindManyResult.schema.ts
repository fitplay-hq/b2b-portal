import * as z from 'zod';
export const BundleFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  orderId: z.string().optional(),
  order: z.unknown().optional(),
  price: z.number().optional(),
  numberOfBundles: z.number().int().optional(),
  items: z.array(z.unknown()),
  bundleOrderItems: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
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