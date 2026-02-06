import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  shortCode: z.string().max(10),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SubCategoryCreateManyCategoryInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateManyCategoryInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateManyCategoryInput>;
export const SubCategoryCreateManyCategoryInputObjectZodSchema = makeSchema();
