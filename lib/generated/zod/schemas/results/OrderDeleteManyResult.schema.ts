import * as z from 'zod';
export const OrderDeleteManyResultSchema = z.object({
  count: z.number()
});