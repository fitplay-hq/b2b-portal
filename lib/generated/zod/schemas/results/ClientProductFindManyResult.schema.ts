import * as z from 'zod';
export const ClientProductFindManyResultSchema = z.object({
  data: z.array(z.object({
  id: z.string(),
  client: z.unknown(),
  clientId: z.string(),
  product: z.unknown(),
  productId: z.string(),
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