import * as z from 'zod';
export const SubCategoryUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  categoryId: z.string(),
  shortCode: z.string(),
  category: z.unknown(),
  products: z.array(z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date()
}));