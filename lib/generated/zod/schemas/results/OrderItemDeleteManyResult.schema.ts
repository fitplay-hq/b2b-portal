import * as z from 'zod';
export const OrderItemDeleteManyResultSchema = z.object({
  count: z.number()
});