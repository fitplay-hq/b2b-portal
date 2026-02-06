import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  categoryId: z.string(),
  shortCode: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const SubCategoryUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.SubCategoryUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.SubCategoryUncheckedCreateWithoutProductsInput>;
export const SubCategoryUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();
