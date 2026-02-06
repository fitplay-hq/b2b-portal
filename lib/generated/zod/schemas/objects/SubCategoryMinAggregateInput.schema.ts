import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  name: z.literal(true).optional(),
  categoryId: z.literal(true).optional(),
  shortCode: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const SubCategoryMinAggregateInputObjectSchema: z.ZodType<Prisma.SubCategoryMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryMinAggregateInputType>;
export const SubCategoryMinAggregateInputObjectZodSchema = makeSchema();
