import * as z from 'zod';
export const OrderItemFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  order: z.unknown(),
  orderId: z.string(),
  product: z.unknown(),
  productId: z.string(),
  quantity: z.number().int(),
  price: z.number()
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