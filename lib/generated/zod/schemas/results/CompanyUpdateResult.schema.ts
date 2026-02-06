import * as z from 'zod';
export const CompanyUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  products: z.array(z.unknown()),
  clients: z.array(z.unknown())
}));