import * as z from 'zod';
export const OrderCreateManyResultSchema = z.object({
  count: z.number()
});