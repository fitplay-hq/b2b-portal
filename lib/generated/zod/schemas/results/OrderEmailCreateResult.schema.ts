import * as z from 'zod';
export const OrderEmailCreateResultSchema = z.object({
  id: z.string(),
  order: z.unknown(),
  orderId: z.string(),
  purpose: z.unknown(),
  isSent: z.boolean(),
  sentAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});