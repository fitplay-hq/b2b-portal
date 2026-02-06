import * as z from 'zod';
export const ProductDeleteManyResultSchema = z.object({
  count: z.number()
});