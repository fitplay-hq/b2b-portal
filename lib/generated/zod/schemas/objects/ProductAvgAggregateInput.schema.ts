import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  price: z.literal(true).optional(),
  availableStock: z.literal(true).optional(),
  minStockThreshold: z.literal(true).optional(),
  avgRating: z.literal(true).optional(),
  noOfReviews: z.literal(true).optional()
}).strict();
export const ProductAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProductAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductAvgAggregateInputType>;
export const ProductAvgAggregateInputObjectZodSchema = makeSchema();
