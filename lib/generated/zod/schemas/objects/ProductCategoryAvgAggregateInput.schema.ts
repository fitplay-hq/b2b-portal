import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const ProductCategoryAvgAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategoryAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryAvgAggregateInputType>;
export const ProductCategoryAvgAggregateInputObjectZodSchema = makeSchema();
