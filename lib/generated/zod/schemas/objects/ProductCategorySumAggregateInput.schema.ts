import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  sortOrder: z.literal(true).optional()
}).strict();
export const ProductCategorySumAggregateInputObjectSchema: z.ZodType<Prisma.ProductCategorySumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategorySumAggregateInputType>;
export const ProductCategorySumAggregateInputObjectZodSchema = makeSchema();
