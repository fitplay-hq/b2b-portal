import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryCreateNestedManyWithoutCategoryInputObjectSchema as SubCategoryCreateNestedManyWithoutCategoryInputObjectSchema } from './SubCategoryCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string().max(50),
  displayName: z.string().max(100),
  description: z.string().max(255).optional().nullable(),
  shortCode: z.string().max(10),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subCategories: z.lazy(() => SubCategoryCreateNestedManyWithoutCategoryInputObjectSchema).optional()
}).strict();
export const ProductCategoryCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.ProductCategoryCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryCreateWithoutProductsInput>;
export const ProductCategoryCreateWithoutProductsInputObjectZodSchema = makeSchema();
