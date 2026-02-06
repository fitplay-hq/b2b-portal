import * as z from 'zod';
export const OrderEmailFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  order: z.unknown(),
  orderId: z.string(),
  purpose: z.unknown(),
  isSent: z.boolean(),
  sentAt: z.date().optional(),
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