import * as z from 'zod';
import type { Prisma } from '../../../prisma';
import { SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema as SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema } from './SubCategoryUncheckedCreateNestedManyWithoutCategoryInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  displayName: z.string(),
  description: z.string().optional().nullable(),
  shortCode: z.string(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  subCategories: z.lazy(() => SubCategoryUncheckedCreateNestedManyWithoutCategoryInputObjectSchema).optional()
}).strict();
export const ProductCategoryUncheckedCreateWithoutProductsInputObjectSchema: z.ZodType<Prisma.ProductCategoryUncheckedCreateWithoutProductsInput> = makeSchema() as unknown as z.ZodType<Prisma.ProductCategoryUncheckedCreateWithoutProductsInput>;
export const ProductCategoryUncheckedCreateWithoutProductsInputObjectZodSchema = makeSchema();
