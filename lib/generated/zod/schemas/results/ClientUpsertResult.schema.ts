import * as z from 'zod';
export const ClientUpsertResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  phone: z.string(),
  company: z.unknown().optional(),
  companyID: z.string().optional(),
  companyName: z.string().optional(),
  isShowPrice: z.boolean(),
  address: z.string(),
  role: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  orders: z.array(z.unknown()),
  products: z.array(z.unknown())
});