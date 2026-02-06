import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  categoryId: z.string(),
  shortCode: z.string().max(10),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SubCategoryCreateManyInputObjectSchema: z.ZodType<Prisma.SubCategoryCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryCreateManyInput>;
export const SubCategoryCreateManyInputObjectZodSchema = makeSchema();
