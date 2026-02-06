import * as z from 'zod';
export const OrderItemCreateResultSchema = z.object({
  id: z.string(),
  order: z.unknown(),
  orderId: z.string(),
  product: z.unknown(),
  productId: z.string(),
  quantity: z.number().int(),
  price: z.number()
});