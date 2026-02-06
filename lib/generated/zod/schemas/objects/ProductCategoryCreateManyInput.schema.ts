import * as z from 'zod';
import type { Prisma } from '../../../prisma';


const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  displayName: z.string().max(100),
  description: z.string().max(255).optional().nullable(),
  shortCode: z.string().max(10),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const ProductCategoryCreateManyInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateManyInput>;
export const ProductCategoryCreateManyInputObjectZodSchema = makeSchema();
