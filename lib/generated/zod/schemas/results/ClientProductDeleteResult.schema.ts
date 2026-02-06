import * as z from 'zod';
export const ClientProductDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  client: z.unknown(),
  clientId: z.string(),
  product: z.unknown(),
  productId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
}));