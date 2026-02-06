import * as z from 'zod';
export const ProductCategoryUpdateResultSchema = z.nullable(z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  shortCode: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  products: z.array(z.unknown()),
  subCategories: z.array(z.unknown())
}));