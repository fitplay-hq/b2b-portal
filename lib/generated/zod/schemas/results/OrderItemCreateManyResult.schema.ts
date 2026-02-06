import * as z from 'zod';
export const OrderItemCreateManyResultSchema = z.object({
  count: z.number()
});