import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  price: z.literal(true).optional(),
  sku: z.literal(true).optional(),
  availableStock: z.literal(true).optional(),
  minStockThreshold: z.literal(true).optional(),
  inventoryUpdateReason: z.literal(true).optional(),
  description: z.literal(true).optional(),
  categories: z.literal(true).optional(),
  categoryId: z.literal(true).optional(),
  subCategoryId: z.literal(true).optional(),
  avgRating: z.literal(true).optional(),
  noOfReviews: z.literal(true).optional(),
  brand: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProductMinAggregateInputObjectSchema: z.ZodType<Prisma.ProductMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductMinAggregateInputType>;
export const ProductMinAggregateInputObjectZodSchema = makeSchema();
