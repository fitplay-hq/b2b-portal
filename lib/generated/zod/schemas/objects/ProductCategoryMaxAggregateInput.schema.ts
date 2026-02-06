import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  displayName: z.literal(true).optional(),
  description: z.literal(true).optional(),
  shortCode: z.literal(true).optional(),
  isActive: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const ProductCategoryMaxAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategoryMaxAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryMaxAggregateInputType>;
export const ProductCategoryMaxAggregateInputObjectZodSchema = makeSchema();
